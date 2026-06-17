package service

import (
	"context"
	"time"

	"ultrathreads/internal/domain"
	"ultrathreads/internal/repository"
)

type CoursesService struct {
	repo           repository.Courses
	modulesService Modules
}

func NewCoursesService(repo repository.Courses, modulesService Modules) *CoursesService {
	return &CoursesService{repo: repo, modulesService: modulesService}
}

func (s *CoursesService) Create(ctx context.Context, schoolID uint, name string) (uint, error) {
	return s.repo.Create(ctx, schoolID, domain.Course{
		Name:      name,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	})
}

func (s *CoursesService) Update(ctx context.Context, inp UpdateCourseInput) error {
	updateInput := repository.UpdateCourseInput{
		ID:          inp.CourseID,
		SchoolID:    inp.SchoolID,
		Name:        inp.Name,
		ImageURL:    inp.ImageURL,
		Description: inp.Description,
		Color:       inp.Color,
		Published:   inp.Published,
	}

	return s.repo.Update(ctx, updateInput)
}

func (s *CoursesService) Delete(ctx context.Context, schoolID, courseID uint) error {
	if err := s.repo.Delete(ctx, schoolID, courseID); err != nil {
		return err
	}

	return s.modulesService.DeleteByCourse(ctx, schoolID, courseID)
}
