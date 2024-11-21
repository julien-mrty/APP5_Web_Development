package helpers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// HandleGetAll handles retrieving all items.
func HandleGetAll(c *gin.Context, getAllFunc func() (interface{}, error)) {
	items, err := getAllFunc()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, items)
}

// HandleCreate handles creating a new item.
func HandleCreate[T any](c *gin.Context, createFunc func(*T) error) {
	var item T
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := createFunc(&item); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, item)
}

// HandleGetByID handles retrieving an item by ID.
func HandleGetByID(c *gin.Context, idParam string, getByIDFunc func(string) (interface{}, error)) {
	id := c.Param(idParam)
	item, err := getByIDFunc(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}
	c.JSON(http.StatusOK, item)
}
