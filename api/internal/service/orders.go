package service

import (
	"context"
	"time"

	"ultrathreads/internal/domain"
	"ultrathreads/internal/repository"
)

type OrdersService struct {
	offersService     Offers
	promoCodesService PromoCodes
	studentsService   Students

	repo repository.Orders
}

func NewOrdersService(repo repository.Orders, offersService Offers, promoCodesService PromoCodes, studentsService Students) *OrdersService {
	return &OrdersService{
		repo:              repo,
		offersService:     offersService,
		promoCodesService: promoCodesService,
		studentsService:   studentsService,
	}
}

func (s *OrdersService) Create(ctx context.Context, studentID, offerID, promocodeID uint) (uint, error) {
	offer, err := s.offersService.GetById(ctx, offerID)
	if err != nil {
		return 0, err
	}

	promocode, err := s.getOrderPromocode(ctx, offer.SchoolID, promocodeID)
	if err != nil {
		return 0, err
	}

	student, err := s.studentsService.GetById(ctx, offer.SchoolID, studentID)
	if err != nil {
		return 0, err
	}

	orderAmount := s.calculateOrderPrice(offer.Price.Value, promocode)

	order := domain.Order{
		SchoolID: offer.SchoolID,
		Student: domain.StudentInfoShort{
			ID:    student.ID,
			Name:  student.Name,
			Email: student.Email,
		},
		Offer: domain.OrderOfferInfo{
			ID:   offer.ID,
			Name: offer.Name,
		},
		Amount:       orderAmount,
		Currency:     offer.Price.Currency,
		CreatedAt:    time.Now(),
		Status:       domain.OrderStatusCreated,
		Transactions: make([]domain.Transaction, 0),
	}

	if promocode.ID != 0 {
		order.Promo = domain.OrderPromoInfo{
			ID:   promocode.ID,
			Code: promocode.Code,
		}
	}

	if err := s.repo.Create(ctx, order); err != nil {
		return 0, err
	}

	return order.ID, nil
}

func (s *OrdersService) AddTransaction(ctx context.Context, id uint, transaction domain.Transaction) (domain.Order, error) {
	return s.repo.AddTransaction(ctx, id, transaction)
}

func (s *OrdersService) GetBySchool(ctx context.Context, schoolID uint, query domain.GetOrdersQuery) ([]domain.Order, int64, error) {
	return s.repo.GetBySchool(ctx, schoolID, query)
}

func (s *OrdersService) GetById(ctx context.Context, id uint) (domain.Order, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *OrdersService) SetStatus(ctx context.Context, id uint, status string) error {
	return s.repo.SetStatus(ctx, id, status)
}

func (s *OrdersService) getOrderPromocode(ctx context.Context, schoolID, promocodeID uint) (domain.PromoCode, error) {
	var (
		promocode domain.PromoCode
		err       error
	)

	if promocodeID != 0 {
		promocode, err = s.promoCodesService.GetById(ctx, schoolID, promocodeID)
		if err != nil {
			return promocode, err
		}

		if promocode.ExpiresAt.Unix() < time.Now().Unix() {
			return promocode, domain.ErrPromocodeExpired
		}
	}

	return promocode, nil
}

func (s *OrdersService) calculateOrderPrice(price uint, promocode domain.PromoCode) uint {
	if promocode.ID == 0 {
		return price
	}
	return (price * uint(100-promocode.DiscountPercentage)) / 100
}
