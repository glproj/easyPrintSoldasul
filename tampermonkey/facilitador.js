"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let printButton = $("[title=Imprimir]");
const updateURL = "http://localhost:8080/update";
printButton.on("click", function () {
    return __awaiter(this, void 0, void 0, function* () {
        let clickedButton = $(this);
        let printCell = clickedButton.parent().parent();
        let orderNumber = printCell.next().text().trim();
        let businessName = printCell.next().next().text().trim();
        let orderType = printCell.next().next().next().next().text().trim();
        let queryParams = {
            businessName: businessName,
            orderNumber: orderNumber,
            orderType: orderType,
            checkForDuplicate: "true",
        };
        let queryURL = new URL(updateURL);
        queryURL.search = new URLSearchParams(queryParams).toString();
        let res = yield fetch(queryURL)
            .then((response) => __awaiter(this, void 0, void 0, function* () {
            if (!response.ok) {
                let message = yield response.json();
                throw new Error(message);
            }
            console.log(response);
        }))
            .catch((error) => __awaiter(this, void 0, void 0, function* () {
            if (error.message.includes("Found another row")) {
                let goOn = confirm("Há um pedido com o mesmo número na tabela. Desejas prosseguir mesmo assim?");
                if (goOn) {
                    queryParams.checkForDuplicate = "";
                    queryURL = new URL(updateURL);
                    queryURL.search = new URLSearchParams(queryParams).toString();
                    let res = yield fetch(queryURL)
                        .then((response) => __awaiter(this, void 0, void 0, function* () {
                        if (!response.ok) {
                            let message = yield response.json();
                            alert(message);
                        }
                        console.log(response);
                    }))
                        .catch((error) => {
                        alert(error.message);
                    });
                }
            }
            else {
                alert(error);
            }
        }));
    });
});
