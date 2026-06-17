package domain

import "errors"

const (
	PaymentProviderFondy = "fondy"
)

var (
	ErrPaymentProviderNotUsed = errors.New("payment provider is disabled for current offer")
	ErrUnknownPaymentProvider = errors.New("payment provider is not supported")
)

type Offer struct {
	ID            uint          `gorm:"primaryKey;autoIncrement" json:"id"`                           // 优惠ID
	Name          string        `gorm:"size:255;not null" json:"name"`                                // 优惠名称
	Description   string        `gorm:"type:text" json:"description"`                                 // 优惠描述
	Benefits      []string      `gorm:"serializer:json" json:"benefits"`                              // 权益列表
	SchoolID      uint          `gorm:"not null;index" json:"schoolId"`                               // 所属学校ID
	PackageIDs    []uint        `gorm:"serializer:json" json:"packages"`                              // 包含套餐ID列表
	Price         Price         `gorm:"embedded;embeddedPrefix:price_" json:"price"`                  // 价格信息
	PaymentMethod PaymentMethod `gorm:"embedded;embeddedPrefix:paymentMethod_" json:"paymentMethod"`  // 支付方式
}

type Price struct {
	Value    uint   `gorm:"not null;default:0" json:"value"`              // 价格数值
	Currency string `gorm:"size:10;not null;default:'USD'" json:"currency"` // 货币类型
}

type PaymentMethod struct {
	UsesProvider bool   `gorm:"not null;default:false" json:"usesProvider"` // 是否使用支付提供商
	Provider     string `gorm:"size:50" json:"provider"`                    // 支付提供商名称
}

func (pm PaymentMethod) Validate() error {
	switch pm.Provider {
	case PaymentProviderFondy:
		return nil
	default:
		return errors.New("unknown payment provider")
	}
}
