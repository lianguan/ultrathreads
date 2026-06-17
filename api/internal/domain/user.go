package domain

import "time"

type User struct {
	ID           uint         `gorm:"primaryKey;autoIncrement" json:"id"`                // 用户ID
	Name         string       `gorm:"size:255;not null" json:"name"`                     // 用户名
	Email        string       `gorm:"size:255;not null;uniqueIndex" json:"email"`        // 邮箱
	Phone        string       `gorm:"size:50" json:"phone"`                              // 电话
	Password     string       `gorm:"size:255;not null" json:"password"`                 // 密码
	RegisteredAt time.Time    `gorm:"not null" json:"registeredAt"`                      // 注册时间
	LastVisitAt  time.Time    `gorm:"not null" json:"lastVisitAt"`                       // 最后登录时间
	Verification Verification `gorm:"embedded;embeddedPrefix:verification_" json:"verification"` // 邮箱验证信息
	Schools      []uint       `gorm:"serializer:json" json:"schools"`                    // 关联学校ID列表
}
