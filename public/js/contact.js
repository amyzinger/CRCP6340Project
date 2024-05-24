(function () {
  "use strict";

  let form = document.querySelector("#contact-form");
  let responseDiv = document.querySelector("#contact-button-response");

  document.querySelector("#send-contact").addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    let formValid = form.checkValidity();
    form.classList.add("was-validated");
    if (formValid) {
      sendTheEmail();
    }
  });

  function sendTheEmail() {
    let obj = {
      sub: "Someone submitted a contact form!",
      txt: `${document.querySelector("#contact-first").value} ${
        document.querySelector("#contact-last").value
      } sent you a message that reads ${
        document.querySelector("#contact-question").value
      }. Their email address is ${
        document.querySelector("#contact-email-addr").value
      }`,
    };

    fetch("/mail", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((r) => r.json())
      .then((response) => {
        responseDiv.innerHTML = '<div class="alert alert-success" role="alert">Thank you! Your message has been submitted successfully.</div>';
        form.reset();
        form.classList.remove("was-validated");  // Reset validation state
      })
      // .then(() => {
      //   setTimeout(() => {
      //     responseDiv.innerHTML = "";
      //   }, 5000);
      // })
      .catch((error) => {
        responseDiv.innerHTML = '<div class="alert alert-danger" role="alert">There was an error submitting your message. Please try again later.</div>';
        setTimeout(() => {
          responseDiv.innerHTML = "";
        }, 5000);
      });
  }
})();
