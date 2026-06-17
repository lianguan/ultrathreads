package service

import (
	"context"
	"sort"

	"ultrathreads/internal/domain"
	"ultrathreads/internal/repository"
)

type ModulesService struct {
	repo        repository.Modules
	contentRepo repository.LessonContent
}

func NewModulesService(repo repository.Modules, contentRepo repository.LessonContent) *ModulesService {
	return &ModulesService{repo: repo, contentRepo: contentRepo}
}

func (s *ModulesService) GetPublishedByCourseId(ctx context.Context, courseID uint) ([]domain.Module, error) {
	modules, err := s.repo.GetPublishedByCourseID(ctx, courseID)
	if err != nil {
		return nil, err
	}

	for i := range modules {
		sortLessons(modules[i].Lessons)
	}

	return modules, nil
}

func (s *ModulesService) GetByCourseId(ctx context.Context, courseID uint) ([]domain.Module, error) {
	modules, err := s.repo.GetByCourseID(ctx, courseID)
	if err != nil {
		return nil, err
	}

	for i := range modules {
		sortLessons(modules[i].Lessons)
	}

	return modules, nil
}

func (s *ModulesService) GetById(ctx context.Context, moduleID uint) (domain.Module, error) {
	module, err := s.repo.GetPublishedByID(ctx, moduleID)
	if err != nil {
		return module, err
	}

	sortLessons(module.Lessons)

	return module, nil
}

func (s *ModulesService) GetWithContent(ctx context.Context, moduleID uint) (domain.Module, error) {
	module, err := s.repo.GetByID(ctx, moduleID)
	if err != nil {
		return module, err
	}

	lessonIDs := make([]uint, 0, len(module.Lessons))
	publishedLessons := make([]domain.Lesson, 0)

	for _, lesson := range module.Lessons {
		if lesson.Published {
			publishedLessons = append(publishedLessons, lesson)
			lessonIDs = append(lessonIDs, lesson.ID)
		}
	}

	module.Lessons = publishedLessons

	content, err := s.contentRepo.GetByLessons(ctx, lessonIDs)
	if err != nil {
		return module, err
	}

	for i := range module.Lessons {
		for _, lessonContent := range content {
			if module.Lessons[i].ID == lessonContent.LessonID {
				module.Lessons[i].Content = lessonContent.Content
			}
		}
	}

	sortLessons(module.Lessons)

	return module, nil
}

func (s *ModulesService) GetByPackages(ctx context.Context, packageIDs []uint) ([]domain.Module, error) {
	modules, err := s.repo.GetByPackages(ctx, packageIDs)
	if err != nil {
		return nil, err
	}

	for i := range modules {
		sortLessons(modules[i].Lessons)
	}

	return modules, nil
}

func (s *ModulesService) GetByLesson(ctx context.Context, lessonID uint) (domain.Module, error) {
	return s.repo.GetByLesson(ctx, lessonID)
}

func (s *ModulesService) Create(ctx context.Context, inp CreateModuleInput) (uint, error) {
	module := domain.Module{
		Name:     inp.Name,
		Position: inp.Position,
		CourseID: inp.CourseID,
		SchoolID: inp.SchoolID,
	}

	return s.repo.Create(ctx, module)
}

func (s *ModulesService) Update(ctx context.Context, inp UpdateModuleInput) error {
	updateInput := repository.UpdateModuleInput{
		ID:        inp.ID,
		SchoolID:  inp.SchoolID,
		Name:      inp.Name,
		Position:  inp.Position,
		Published: inp.Published,
	}

	return s.repo.Update(ctx, updateInput)
}

func (s *ModulesService) Delete(ctx context.Context, schoolID, moduleID uint) error {
	module, err := s.repo.GetByID(ctx, moduleID)
	if err != nil {
		return err
	}

	if err := s.repo.Delete(ctx, schoolID, moduleID); err != nil {
		return err
	}

	lessonIDs := make([]uint, len(module.Lessons))
	for i, lesson := range module.Lessons {
		lessonIDs[i] = lesson.ID
	}

	return s.contentRepo.DeleteContent(ctx, schoolID, lessonIDs)
}

func (s *ModulesService) DeleteByCourse(ctx context.Context, schoolID, courseID uint) error {
	modules, err := s.repo.GetPublishedByCourseID(ctx, courseID)
	if err != nil {
		return err
	}

	if err := s.repo.DeleteByCourse(ctx, schoolID, courseID); err != nil {
		return err
	}

	lessonIDs := make([]uint, 0)

	for _, module := range modules {
		for _, lesson := range module.Lessons {
			lessonIDs = append(lessonIDs, lesson.ID)
		}
	}

	return s.contentRepo.DeleteContent(ctx, schoolID, lessonIDs)
}

func sortLessons(lessons []domain.Lesson) {
	sort.Slice(lessons, func(i, j int) bool {
		return lessons[i].Position < lessons[j].Position
	})
}
