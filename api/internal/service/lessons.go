package service

import (
	"context"
	"errors"

	"ultrathreads/internal/domain"
	"ultrathreads/internal/repository"
	"gorm.io/gorm"
)

type LessonsService struct {
	repo        repository.Modules
	contentRepo repository.LessonContent
}

func NewLessonsService(repo repository.Modules, contentRepo repository.LessonContent) *LessonsService {
	return &LessonsService{repo: repo, contentRepo: contentRepo}
}

func (s *LessonsService) Create(ctx context.Context, inp AddLessonInput) (uint, error) {
	lesson := domain.Lesson{
		SchoolID: inp.SchoolID,
		Name:     inp.Name,
		Position: inp.Position,
	}

	if err := s.repo.AddLesson(ctx, inp.SchoolID, inp.ModuleID, lesson); err != nil {
		return 0, err
	}

	return lesson.ID, nil
}

func (s *LessonsService) GetById(ctx context.Context, lessonID uint) (domain.Lesson, error) {
	module, err := s.repo.GetByLesson(ctx, lessonID)
	if err != nil {
		return domain.Lesson{}, err
	}

	var lesson domain.Lesson

	for _, l := range module.Lessons {
		if l.ID == lessonID {
			lesson = l
		}
	}

	content, err := s.contentRepo.GetByLesson(ctx, lessonID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return lesson, nil
		}

		return lesson, err
	}

	lesson.Content = content.Content

	return lesson, nil
}

func (s *LessonsService) Update(ctx context.Context, inp UpdateLessonInput) error {
	if inp.Name != "" || inp.Position != nil || inp.Published != nil {
		if err := s.repo.UpdateLesson(ctx, repository.UpdateLessonInput{
			ID:        inp.LessonID,
			Name:      inp.Name,
			Position:  inp.Position,
			Published: inp.Published,
			SchoolID:  inp.SchoolID,
		}); err != nil {
			return err
		}
	}

	if inp.Content != "" {
		if err := s.contentRepo.Update(ctx, inp.SchoolID, inp.LessonID, inp.Content); err != nil {
			return err
		}
	}

	return nil
}

func (s *LessonsService) Delete(ctx context.Context, schoolID, id uint) error {
	return s.repo.DeleteLesson(ctx, schoolID, id)
}

func (s *LessonsService) DeleteContent(ctx context.Context, schoolID uint, lessonIDs []uint) error {
	return s.contentRepo.DeleteContent(ctx, schoolID, lessonIDs)
}
