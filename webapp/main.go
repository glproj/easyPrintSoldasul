package main

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/xuri/excelize/v2"
)

type IsDuplicate struct {
	orderNumberStr string
}

func (e *IsDuplicate) Error() string {
	return "Found another row with " + e.orderNumberStr + " as its order number."
}
	orderNumberStr := strconv.Itoa(orderNumber)
	sheet := file.GetSheetList()[0]
	rows, err := file.GetRows(sheet)
	if err != nil {
		return err
	}
	if checkForDuplicate {
		for _, row := range rows {
			otherOrderNumber := row[0]
			if orderNumberStr == otherOrderNumber {
				return &IsDuplicate{orderNumberStr: orderNumberStr}
			}
		}
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
func updateHandler(c *gin.Context) {
	fileName := c.Query("fileName")
	if fileName == "" {
		fileName = "test.xlsx"
	}
	f, err := excelize.OpenFile(fileName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, "Could not open file: "+err.Error())
		return
	}
	defer func() {
		if err := f.Close(); err != nil {
			fmt.Println(err)
			return
		}
	}()
	if c.Query("orderNumber") == "" {
		c.JSON(http.StatusInternalServerError, "Please enter orderNumber query.")
		return
	}
	orderNumber, err := strconv.Atoi(c.Query("orderNumber"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, "Could not convert orderNumber to int: "+err.Error())
		return
	}
	businessName := c.Query("businessName")
	orderType := c.Query("orderType")
	if businessName == "" {
		c.JSON(http.StatusInternalServerError, "Please enter businessName query.")
		return
	}
	if orderType == "" {
		c.JSON(http.StatusInternalServerError, "Please enter orderType query.")
		return
	}
	err = updateRow(orderNumber, businessName, orderType, f)
	if err != nil {
		c.JSON(http.StatusInternalServerError, "Could not update row: "+err.Error())
		return
	}
	if err := f.SaveAs(fileName); err != nil {
		c.JSON(http.StatusInternalServerError, "Could not save file: "+err.Error())
		return
	}
	c.JSON(http.StatusOK, "success!")
}
func main() {
	router := gin.Default()
	router.GET("/update", updateHandler)
	router.Run(":8080")
}
