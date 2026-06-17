package domain

import "time"

const (
	OrderStatusCreated  = "created"  // 已创建
	OrderStatusPaid     = "paid"     // 已支付
	OrderStatusFailed   = "failed"   // 支付失败
	OrderStatusCanceled = "canceled" // 已取消
	OrderStatusOther    = "other"    // 其他
)

type Order struct {
	ID           uint             `gorm:"primaryKey;autoIncrement" json:"id"`       // 订单ID
	SchoolID     uint             `gorm:"not null;index" json:"schoolId"`           // 所属学校ID
	Student      StudentInfoShort `gorm:"serializer:json" json:"student"`           // 学生信息
	Offer        OrderOfferInfo   `gorm:"serializer:json" json:"offer"`             // 优惠信息
	Promo        OrderPromoInfo   `gorm:"serializer:json" json:"promo"`             // 优惠码信息
	CreatedAt    time.Time        `gorm:"not null" json:"createdAt"`                // 创建时间
	Amount       uint             `gorm:"not null" json:"amount"`                   // 订单金额
	Currency     string           `gorm:"size:10;not null" json:"currency"`         // 货币类型
	Status       string           `gorm:"size:50;not null;index" json:"status"`     // 订单状态
	Transactions []Transaction    `gorm:"serializer:json" json:"transactions"`      // 交易记录
}

type OrderOfferInfo struct {
	ID   uint   `json:"id"`   // 优惠ID
	Name string `json:"name"` // 优惠名称
}

type OrderPromoInfo struct {
	ID   uint   `json:"id"`   // 优惠码ID
	Code string `json:"code"` // 优惠码
}

type Transaction struct {
	Status         string    `json:"status"`         // 交易状态
	CreatedAt      time.Time `json:"createdAt"`      // 交易时间
	AdditionalInfo string    `json:"additionalInfo"` // 附加信息
}
