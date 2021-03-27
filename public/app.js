intakeId = null;

// // views
// var userView = document.querySelector("#userView");
// var dash = document.querySelector("#dash");

// // register
// var user_first_name = document.querySelector("#first-name");
// var user_last_name = document.querySelector("#last-name");
// var user_email = document.querySelector("#email");
// var user_password = document.querySelector("#password");
// var register_button = document.querySelector("#register-button");

// // login
// var username = document.querySelector("#username");
// var passw = document.querySelector("#passw");
// var login_button = document.querySelector('#login-button');

// // authenication
// register_button.onclick = function(user) {
// 	var firstName = user_first_name.value;
// 	var lastName = user_last_name.value;
//   var email = user_email.value;
// 	var encryptedPassword = user_password.value;

// 	var data = 'email=' + encodeURIComponent(user.email);
//     data += '&firstName=' + encodeURIComponent(user.firstName);
//     data += '&lastName=' + encodeURIComponent(user.lastName);
//     data += '&encryptedPassword=' + encodeURIComponent(user.encryptedPassword);
	
// 	fetch("http://localhost:8080/users", {
// 		method: "POST",
// 		credentials: "include",
// 		body: data,
// 		headers: {
// 			"Content-Type": "application/x-www-form-urlencoded"
// 		}
// 	}).then(function(response) {
// 		if (response.status == 201) {
// 			var success = document.createElement("p");
// 			success.innerHTML = "Registration complete";
// 			document.querySelector("#register").appendChild(success);
// 		} else {
// 			alert("This username already exists");
// 		}
// 	})
// 	resetForm([user_first_name, user_last_name, user_email, user_password]);
// }

// function resetForm(inputs) {
//   for (i = 0; i < inputs.length; i++) {
//       inputs[i].value = '';
//   }
// }

/////////////

function totalCals(data) {
  var total = 0;
  for (i = 0; i < data.length; i++) {
      total += data[i].calories;
  }
  return total;
}

function createUserOnServer(user) {
  var userData = "email=" + encodeURIComponent(user.email);
  userData += "&firstName=" + encodeURIComponent(user.firstName);
  userData += "&lastName=" + encodeURIComponent(user.lastName);
  userData += "&encryptedPassword=" + encodeURIComponent(user.encryptedPassword);

  return fetch("http://localhost:8080/users", {
    method: "POST",
    body: userData,
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

function createIntakeOnServer(intake) {
  var intakeData = "category=" + encodeURIComponent(intake.category);
  intakeData += "&food=" + encodeURIComponent(intake.food);
  intakeData += "&serving=" + encodeURIComponent(intake.serving);
  intakeData += "&calories=" + encodeURIComponent(intake.calories);

  return fetch("http://localhost:8080/intakes", {
    method: "POST",
    body: intakeData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

function updateIntakeOnServer(intake) {
  var intakeData = "category=" + encodeURIComponent(intake.category);
  intakeData += "&food=" + encodeURIComponent(intake.food);
  intakeData += "&serving=" + encodeURIComponent(intake.serving);
  intakeData += "&calories=" + encodeURIComponent(intake.calories);

  return fetch("http://localhost:8080/intakes/" + intake.id, {
    method: "PUT",
    body: intakeData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

function deleteIntakeFromServer(intakeId) {
  return fetch("http://localhost:8080/intakes/" + intakeId, {
		method: "DELETE"
	});
}

function getIntakeListFromServer() {
  return fetch("http://localhost:8080/intakes");
}

var app = new Vue({
  el: '#app',
  data: {
    userEmail: '',
    userfName: '',
    userlName: '',
    userPassword: '',
    totalCalories: '',
    intakeCategory: '',
    intakeFood: '',
    intakeServing: '',
    intakeCalories: '',
    intakes: [],
    activeColor: {
      color: 'red',
    },
    errorMessages: []
  },
  methods: {
    validateIntake: function () {
      this.errorMessages = [];

      if (this.intakeCategory.length == 0) {
        this.errorMessages.push("Specify a category.");
      }
      if (this.intakeFood.length == 0) {
        this.errorMessages.push("Specify a food.");
      }
      if (this.intakeServing.length == 0) {
        this.errorMessages.push("Specify a serving.");
      }
      if (this.intakeCalories.length == 0) {
        this.errorMessages.push("Specify calories.");
      }
      return this.errorMessages == 0;
    },
    createUser: function () {
      createUserOnServer({
        email: this.userEmail,
        firstName: this.userfName,
        lastName: this.userlName,
        encryptedPassword: this.userPassword
      }).then((response) => {
        if (response.status == 201) {
        } else {
          alert("username already exists");
        }
      });
      this.userEmail = "";
      this.userfName = "";
      this.userlName = "";
      this.userPassword = "";
    },
    submitNewIntake: function () {
      if (!this.validateIntake()) {
        return;
      }
      createIntakeOnServer({
        category: this.intakeCategory,
        food: this.intakeFood,
        serving: this.intakeServing,
        calories: this.intakeCalories
      }).then((response) => {
        if (response.status == 201) {
          this.loadIntakes();
        } else {
          alert("There was a problem saying your entry. Enter a correct category from the list.");
        }
      });
      this.intakeCategory = "";
      this.intakeFood = "";
      this.intakeServing = "";
      this.intakeCalories = "";
    },
    loadIntakes: function () {
      getIntakeListFromServer().then((response) => {
        response.json().then((data) => {
          console.log("entries loaded from server:", data);
          this.intakes = data;
          this.totalCalories = totalCals(data);
        });
      });
    },
    updateIntake: function (intake) {
      updateIntakeOnServer({
        category: this.intakeCategory,
        food: this.intakeFood,
        serving: this.intakeServing,
        calories: this.intakeCalories,
        id: intakeId
      }).then((response) => {
        if (response.status == 200) {
          this.loadIntakes();
        } else {
          alert("Loading resource failed.");
        }
      });
      this.intakeCategory = "";
      this.intakeFood = "";
      this.intakeServing = "";
      this.intakeCalories = "";
    },
    editIntake: function (intake) {
      intakeId = intake._id;
      this.intakeCategory = intake.category;
      this.intakeFood = intake.food;
      this.intakeServing = intake.serving;
      this.intakeCalories = intake.calories;
      console.log("edit this this entry:", intake);
    },
    removeIntake: function (intake) {
      console.log("delete this entry:", intake);
      deleteIntakeFromServer(intake._id).then((response) => {
        if (response.status == 200) {
          this.loadIntakes();
        } else {
          alert("Loading resource failed.");
        }
      });
    }
  },
  created: function () {
    this.loadIntakes();
  }
});