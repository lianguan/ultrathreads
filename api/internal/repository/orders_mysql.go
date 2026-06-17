package repository

import (
	"context"

	"ultrathreads/internal/domain"
	"gorm.io/gorm"
)

type OrdersRepo struct {
	db *gorm.DB
}

func NewOrdersRepo(db *gorm.DB) *OrdersRepo {
	return &OrdersRepo{db: db}
}

func (r *OrdersRepo) Create(ctx context.Context, order domain.Order) error {
	return r.db.WithContext(ctx).Create(&order).Error
}

func (r *OrdersRepo) AddTransaction(ctx context.Context, id uint, transaction domain.Transaction) (domain.Order, error) {
	var order domain.Order
	if err := r.db.WithContext(ctx).First(&order, id).Error; err != nil {
		return order, err
	}

	order.Transactions = append(order.Transactions, transaction)
	order.Status = transaction.Status

	if err := r.db.WithContext(ctx).Save(&order).Error; err != nil {
		return order, err
	}

	return order, nil
}

func (r *OrdersRepo) GetBySchool(ctx context.Context, schoolID uint, query domain.GetOrdersQuery) ([]domain.Order, int64, error) {
	var orders []domain.Order
	var count int64

	db := r.db.WithContext(ctx).Model(&domain.Order{}).Where("school_id = ?", schoolID)

	if query.Search != "" {
		db = db.Where("student LIKE ? OR offer LIKE ? OR promo LIKE ?",
			"%"+query.Search+"%", "%"+query.Search+"%", "%"+query.Search+"%")
	}
	if query.Status != "" {
		db = db.Where("status = ?", query.Status)
	}
	if query.DateFrom != "" {
		db = db.Where("created_at >= ?", query.DateFrom)
	}
	if query.DateTo != "" {
		db = db.Where("created_at <= ?", query.DateTo)
	}

	if err := db.Count(&count).Error; err != nil {
		return nil, 0, err
	}

	if query.PaginationQuery.Limit > 0 {
		db = db.Limit(int(query.PaginationQuery.Limit))
	}
	if query.PaginationQuery.Skip > 0 {
		db = db.Offset(int(query.PaginationQuery.Skip))
	}

	err := db.Order("created_at DESC").Find(&orders).Error
	return orders, count, err
}

func (r *OrdersRepo) GetByID(ctx context.Context, id uint) (domain.Order, error) {
	var order domain.Order
	err := r.db.WithContext(ctx).First(&order, id).Error
	return order, err
}

func (r *OrdersRepo) SetStatus(ctx context.Context, id uint, status string) error {
	return r.db.WithContext(ctx).
		Model(&domain.Order{}).
		Where("id = ?", id).
		Update("status", status).Error
}
