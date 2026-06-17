package domain

import (
	"time"
)

type Student struct {
	ID               uint         `gorm:"primaryKey;autoIncrement" json:"id"`                // 学生ID
	Name             string       `gorm:"size:255;not null" json:"name"`                     // 学生姓名
	Email            string       `gorm:"size:255;not null;uniqueIndex" json:"email"`        // 邮箱
	Password         string       `gorm:"size:255;not null" json:"password"`                 // 密码
	RegisteredAt     time.Time    `gorm:"not null" json:"registeredAt"`                      // 注册时间
	LastVisitAt      time.Time    `gorm:"not null" json:"lastVisitAt"`                       // 最后登录时间
	SchoolID         uint         `gorm:"not null;index" json:"schoolId"`                    // 所属学校ID
	AvailableModules []uint       `gorm:"serializer:json" json:"availableModules"`           // 可用模块ID列表
	AvailableCourses []uint       `gorm:"serializer:json" json:"availableCourses"`           // 可用课程ID列表
	AvailableOffers  []uint       `gorm:"serializer:json" json:"availableOffers"`            // 可用优惠ID列表
	Verification     Verification `gorm:"embedded;embeddedPrefix:verification_" json:"verification"` // 邮箱验证信息
	Session          Session      `gorm:"embedded;embeddedPrefix:session_" json:"session"`   // 会话信息
	Blocked          bool         `gorm:"not null;default:false" json:"blocked"`             // 是否被封禁
}

func (s Student) IsModuleAvailable(m Module) bool {
	for _, id := range s.AvailableModules {
		if m.ID == id {
			return true
		}
	}
	return false
}

type Verification struct {
	Code     string `gorm:"size:50" json:"code"`              // 验证码
	Verified bool   `gorm:"not null;default:false" json:"verified"` // 是否已验证
}

type StudentLessons struct {
	StudentID  uint   `gorm:"primaryKey" json:"studentId"`   // 学生ID
	Finished   []uint `gorm:"serializer:json" json:"finished"` // 已完成课时ID列表
	LastOpened uint   `json:"lastOpened"`                     // 最后打开的课时ID
}

type StudentInfoShort struct {
	ID    uint   `json:"id"`    // 学生ID
	Name  string `json:"name"`  // 学生姓名
	Email string `json:"email"` // 学生邮箱
}

type UpdateStudentInput struct {
	Name      string `json:"name"`      // 姓名
	Email     string `json:"email"`     // 邮箱
	Verified  *bool  `json:"verified"`  // 是否验证
	Blocked   *bool  `json:"blocked"`   // 是否封禁
	StudentID uint   `json:"-"`         // 学生ID（内部使用）
	SchoolID  uint   `json:"-"`         // 学校ID（内部使用）
}

type CreateStudentInput struct {
	Name     string `json:"name" binding:"required,min=2"`     // 姓名
	Email    string `json:"email" binding:"required,email"`    // 邮箱
	Password string `json:"password" binding:"required,min=6"` // 密码
	SchoolID uint   `json:"-"`                                 // 学校ID（内部使用）
}
