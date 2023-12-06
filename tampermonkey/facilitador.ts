interface UpdateRowParams {
  businessName: string;
  orderNumber: string;
  orderType: string;
  checkForDuplicate?: string;
}

let printButton = $("[title=Imprimir]");
const updateURL = "http://localhost:8080/update";
printButton.on("click", async function () {
  let clickedButton = $(this);
  let printCell = clickedButton.parent().parent();
  let orderNumber = printCell.next().text().trim();
  let businessName = printCell.next().next().text().trim();
  let orderType = printCell.next().next().next().next().text().trim();

  let queryParams: UpdateRowParams = {
    businessName: businessName,
    orderNumber: orderNumber,
    orderType: orderType,
    checkForDuplicate: "true",
  };
  let queryURL = new URL(updateURL);
  queryURL.search = new URLSearchParams(
    queryParams as Record<any, any>
  ).toString();
  let res = await fetch(queryURL)
    .then(async (response) => {
      if (!response.ok) {
        let message = await response.json();
        throw new Error(message);
      }
      console.log(response);
    })
    .catch(async (error: Error) => {
      if (error.message.includes("Found another row")) {
        let goOn = confirm(
          "Há um pedido com o mesmo número na tabela. Desejas prosseguir mesmo assim?"
        );
        if (goOn) {
          queryParams.checkForDuplicate = "";
          queryURL = new URL(updateURL);
          queryURL.search = new URLSearchParams(
            queryParams as Record<any, any>
          ).toString();
          let res = await fetch(queryURL)
            .then(async (response) => {
              if (!response.ok) {
                let message = await response.json();
                alert(message);
              }
              console.log(response);
            })
            .catch((error) => {
              alert(error.message);
            });
        }
      } else {
        alert(error);
      }
    });
});
