package domain

import "time"

type PromoCode struct {
	ID                 uint      `gorm:"primaryKey;autoIncrement" json:"id"`              // 优惠码ID
	SchoolID           uint      `gorm:"not null;index" json:"schoolId"`                  // 所属学校ID
	Code               string    `gorm:"size:100;not null;uniqueIndex" json:"code"`       // 优惠码
	DiscountPercentage int       `gorm:"not null" json:"discountPercentage"`              // 折扣百分比
	ExpiresAt          time.Time `gorm:"not null;index" json:"expiresAt"`                 // 过期时间
	OfferIDs           []uint    `gorm:"serializer:json" json:"offerIds"`                 // 适用优惠ID列表
}

type UpdatePromoCodeInput struct {
	ID                 uint      // 优惠码ID
	SchoolID           uint      // 学校ID
	Code               string    // 优惠码
	DiscountPercentage int       // 折扣百分比
	ExpiresAt          time.Time // 过期时间
	OfferIDs           []uint    // 适用优惠ID列表
}
