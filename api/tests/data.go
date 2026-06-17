package tests

import (
	"time"

	"ultrathreads/internal/domain"
)

var (
	school = domain.School{
		ID: 1,
		Courses: []domain.Course{
			{
				ID:        1,
				Name:      "Course #1",
				Published: true,
			},
			{
				ID:   2,
				Name: "Course #2", // Unpublished course, shouldn't be available to student
			},
		},
		Settings: domain.Settings{
			Domains: []string{"http://localhost:1337", "workshop.ultrathreads.com", ""},
			Fondy: domain.Fondy{
				Connected: true,
			},
		},
	}

	packages = []interface{}{
		domain.Package{
			ID:       1,
			Name:     "Package #1",
			CourseID: school.Courses[0].ID,
		},
	}

	offers = []interface{}{
		domain.Offer{
			ID:          1,
			Name:        "Offer #1",
			Description: "Offer #1 Description",
			SchoolID:    school.ID,
			PackageIDs:  []uint{packages[0].(domain.Package).ID},
			Price:       domain.Price{Value: 6900, Currency: "USD"},
		},
	}

	promocodes = []interface{}{
		domain.PromoCode{
			ID:                 1,
			Code:               "TEST25",
			DiscountPercentage: 25,
			ExpiresAt:          time.Now().Add(time.Hour),
			OfferIDs:           []uint{offers[0].(domain.Offer).ID},
			SchoolID:           school.ID,
		},
	}

	modules = []interface{}{
		domain.Module{
			ID:        1,
			Name:      "Module #1", // Free Module, should be available to anyone
			CourseID:  school.Courses[0].ID,
			Published: true,
			Lessons: []domain.Lesson{
				{
					ID:        1,
					Name:      "Lesson #1",
					Published: true,
				},
			},
		},
		domain.Module{
			ID:        2,
			Name:      "Module #2", // Part of paid package, should be available only after purchase
			CourseID:  school.Courses[0].ID,
			Published: true,
			PackageID: packages[0].(domain.Package).ID,
			Lessons: []domain.Lesson{
				{
					ID:        2,
					Name:      "Lesson #1",
					Published: true,
				},
				{
					ID:        3,
					Name:      "Lesson #2",
					Published: true,
				},
			},
		},
		domain.Module{
			ID:        3,
			Name:      "Module #1", // Part of unpublished course
			CourseID:  school.Courses[1].ID,
			Published: true,
			PackageID: packages[0].(domain.Package).ID,
		},
	}
)
