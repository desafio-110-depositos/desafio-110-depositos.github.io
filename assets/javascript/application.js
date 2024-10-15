const balanceElement = document.getElementById("balance");
const totalAmountElement = document.getElementById("total-amount");
// const amountElements = Array.from(
//   document.querySelectorAll("[data-amount-id]")
// );

const getAmounts = () => {
  const amounts = [];

  let amount = 50;

  for (let i = 0; i < 110; i++) {
    amounts.push(amount);

    if (amount < 100) {
      amount = 100;
      continue;
    }

    if (amount < 1000) {
      amount += 100;
      continue;
    }

    amount += 1000;
  }

  return amounts;
};

const sum = (array) => {
  return array.reduce((prev, next) => prev + next, 0);
};

const storeValue = (value) => {
  const data = getValues();

  localStorage.setItem("data-amounts", JSON.stringify([...data, value]));
};

const getValues = () =>
  JSON.parse(localStorage.getItem("data-amounts") || "[]");

const storedValue = (value) => {
  const data = getValues();
  return data.includes(value);
};

const deleteValue = (value) => {
  const data = getValues();

  localStorage.setItem(
    "data-amounts",
    JSON.stringify(data.filter((current) => current !== value))
  );
};

const bindValueToElement = (element, value) => {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  const values = value instanceof Array ? value : [value];

  for (let i = 0; i < values.length; i++) {
    element.innerText = element.innerText.replace(`\$${i}`, values[0]);
  }
};

const formatCurrency = (amount, currency = "AKZ") =>
  new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: currency,
  }).format(amount);

// for (const amountElement of amountElements) {

// }

let balance = -1;

const updateBalance = () => {
  const amounts = getValues();
  const totalBalance = sum(amounts);

  if (balance !== totalBalance) {
    balance = totalBalance;
    balanceElement.innerHTML = formatCurrency(balance);
  }

  window.requestAnimationFrame(updateBalance);
};

const amounts = getAmounts();

const mainElement = document.getElementById("main");

const handleAmountElement = (amountElement) => {
  const amountElementOriginalValue = parseFloat(amountElement.innerText.trim());
  amountElement.innerHTML = formatCurrency(amountElementOriginalValue);

  if (storedValue(amountElementOriginalValue)) {
    amountElement.classList.add("selected");
  }

  amountElement.addEventListener("click", () => {
    if (storedValue(amountElementOriginalValue)) {
      deleteValue(amountElementOriginalValue);
      return amountElement.classList.remove("selected");
    }

    storeValue(amountElementOriginalValue);
    amountElement.classList.add("selected");
  });
};

if (mainElement instanceof HTMLUListElement) {
  for (let i = 0; i < amounts.length; i++) {
    const amount = amounts[i];

    const amountElement = document.createElement("li");
    amountElement.setAttribute("data-amount-id", i);
    amountElement.innerHTML = amount;

    mainElement.appendChild(amountElement);

    handleAmountElement(amountElement);
  }

  updateBalance();
}

if (totalAmountElement instanceof HTMLElement) {
  totalAmountElement.innerHTML = formatCurrency(sum(amounts));
}

const titleElements = [
  [document.querySelector("#title"), amounts.length],
  [document.querySelector("title"), amounts.length],
  [document.querySelector("i.total-deposits"), amounts.length],
];

for (const [titleElement, value] of titleElements) {
  bindValueToElement(titleElement, value);
}
