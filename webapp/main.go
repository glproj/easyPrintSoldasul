package main

import (
	"fmt"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/xuri/excelize/v2"
)

func updateRow(orderNumber int, businessName string, orderType string, file *excelize.File) error {
	orderNumberStr := strconv.Itoa(orderNumber)
	sheet := file.GetSheetList()[0]
	rows, err := file.GetRows(sheet)
	if err != nil {
		return err
	}
	firstEmptyRowIndex := strconv.Itoa(len(rows) + 1)
	err = file.SetCellValue(sheet, "A"+firstEmptyRowIndex, orderNumberStr)
	if err != nil {
		return err
	}
	err = file.SetCellValue(sheet, "B"+firstEmptyRowIndex, businessName)
	if err != nil {
		return err
	}
	err = file.SetCellValue(sheet, "C"+firstEmptyRowIndex, orderType)
	if err != nil {
		return err
	}

	currentDateTime := time.Now().Format("15:04:05")
	err = file.SetCellValue(sheet, "E"+firstEmptyRowIndex, currentDateTime)
	if err != nil {
		return err
	}
	return nil
}
func main() {
	f, err := excelize.OpenFile("test.xlsx")
	if err != nil {
		fmt.Println(err)
	}
	defer func() {
		if err := f.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	fmt.Println("bruh")
}
