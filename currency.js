
$(document).ready(() => {
    $("#currencyForm").submit((event) => {
      event.preventDefault();
      const amount = $("#amount").val();
      const fromCurrency = $("#fromCurrency").val();
      const toCurrency = $("#toCurrency").val();
      convertCurrency(amount, fromCurrency, toCurrency);
    });
  });
  
  function convertCurrency(amount, fromCurrency, toCurrency) {
    $.post("/currency", { amount, fromCurrency, toCurrency }, (data) => {
      const result = data.result;
      $("#currencyResult").html(`<p>${amount} ${fromCurrency} is approximately ${result} ${toCurrency}</p>`);
    }).fail((error) => {
      console.error("Error converting currency:", error.responseText);
      $("#currencyResult").html("<p>Error converting currency. Please try again later.</p>");
    });
  }
  