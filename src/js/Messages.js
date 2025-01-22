export default class Messages {
  constructor() {
    this.titleError = document.querySelector(".title-error");
    this.wrapper = document.querySelector(".wrapper");
  }

  createElementMessage(email, subject, date) {
    const wrapperMessage = document.createElement("div");
    wrapperMessage.className = "wrapper-message";

    wrapperMessage.innerHTML = `
        <div class="email">${email.length > 15 ? email.substring(0, 15) + "..." : email}</div>
        <div class="subject">${subject.length > 15 ? subject.substring(0, 15) + "..." : subject}</div>
        <div class="date">${date}</div>
        `;

    this.wrapper.insertAdjacentElement("afterbegin", wrapperMessage);
  }

  resetList() {
    const arrayElement = document.querySelectorAll(".wrapper-message");
    arrayElement.forEach((element) => element.remove());
  }

  showError(error) {
    const errorMessage = document.querySelector(".error-message");
    errorMessage.textContent = error;
  }

  clearError() {
    const error = document.querySelector(".error-message");
    error.textContent = "";
  }
}
