package domain

import "time"

type Course struct {
	ID          uint      `gorm:"primaryKey;autoIncrement" json:"id"`  // 课程ID
	Name        string    `gorm:"size:255;not null" json:"name"`       // 课程名称
	Code        string    `gorm:"size:100;uniqueIndex" json:"code"`    // 课程编码
	Description string    `gorm:"type:text" json:"description"`        // 课程描述
	Color       string    `gorm:"size:50" json:"color"`                // 主题颜色
	ImageURL    string    `gorm:"size:500" json:"imageUrl"`            // 封面图片URL
	CreatedAt   time.Time `gorm:"not null" json:"createdAt"`           // 创建时间
	UpdatedAt   time.Time `gorm:"not null" json:"updatedAt"`           // 更新时间
	Published   bool      `gorm:"not null;default:false" json:"published"` // 是否已发布
}

type Module struct {
	ID        uint     `gorm:"primaryKey;autoIncrement" json:"id"`        // 模块ID
	Name      string   `gorm:"size:255;not null" json:"name"`             // 模块名称
	Position  uint     `gorm:"not null;default:0" json:"position"`        // 排序位置
	Published bool     `gorm:"not null;default:false" json:"published"`   // 是否已发布
	CourseID  uint     `gorm:"not null;index" json:"courseId"`            // 所属课程ID
	PackageID uint     `gorm:"index" json:"packageId,omitempty"`          // 所属套餐ID
	SchoolID  uint     `gorm:"not null;index" json:"schoolId"`            // 所属学校ID
	Lessons   []Lesson `gorm:"serializer:json" json:"lessons,omitempty"`  // 课时列表
	Survey    Survey   `gorm:"serializer:json" json:"survey,omitempty"`   // 调查问卷
}

type Lesson struct {
	ID        uint   `gorm:"primaryKey;autoIncrement" json:"id"`      // 课时ID
	Name      string `gorm:"size:255;not null" json:"name"`           // 课时名称
	Position  uint   `gorm:"not null;default:0" json:"position"`      // 排序位置
	Published bool   `gorm:"not null;default:false" json:"published"` // 是否已发布
	Content   string `gorm:"type:text" json:"content,omitempty"`      // 课时内容
	SchoolID  uint   `gorm:"not null;index" json:"schoolId"`          // 所属学校ID
}

type LessonContent struct {
	LessonID uint   `gorm:"primaryKey" json:"lessonId"`      // 课时ID
	SchoolID uint   `gorm:"not null;index" json:"schoolId"`  // 所属学校ID
	Content  string `gorm:"type:text" json:"content"`        // 课时内容
}

type Package struct {
	ID       uint     `gorm:"primaryKey;autoIncrement" json:"id"`  // 套餐ID
	Name     string   `gorm:"size:255;not null" json:"name"`       // 套餐名称
	CourseID uint     `gorm:"not null;index" json:"courseId"`      // 所属课程ID
	SchoolID uint     `gorm:"not null;index" json:"schoolId"`      // 所属学校ID
	Modules  []Module `gorm:"-" json:"modules"`                     // 模块列表
}

type ModuleContent struct {
	Lessons []Lesson `gorm:"serializer:json" json:"lessons"` // 课时列表
	Survey  Survey   `gorm:"serializer:json" json:"survey"`  // 调查问卷
}
