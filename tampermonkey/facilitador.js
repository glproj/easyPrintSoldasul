"use strict";
let printButton = $("[title=Imprimir]");
const updateURL = "http://localhost:8080/update"
printButton.on("click", function () {
    let clickedButton = $(this)
    let printCell = clickedButton.parent().parent();
    let orderNumber = printCell.next().text();
    let businessName = printCell.next().next().text();
    let orderType = printCell.next().next().next().text();
    let queryParams = { "businessName": businessName, "orderNumber": orderNumber, "orderType": orderType }
    let queryURL = new URL(updateURL)
    queryURL.search = new URLSearchParams(queryParams).toString()
    fetch(queryURL).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).catch(error => {
        console.error('Error:', error);
    });
})
