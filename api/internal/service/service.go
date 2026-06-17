package service

import (
	"context"
	"io"
	"time"

	"ultrathreads/internal/config"
	"ultrathreads/internal/domain"
	"ultrathreads/internal/repository"
	"ultrathreads/pkg/auth"
	"ultrathreads/pkg/cache"
	"ultrathreads/pkg/email"
	"ultrathreads/pkg/hash"
	"ultrathreads/pkg/otp"
	"ultrathreads/pkg/storage"
)

//go:generate mockgen -source=service.go -destination=mocks/mock.go

type UserSignUpInput struct {
	Name     string
	Email    string
	Phone    string
	Password string
}

type UserSignInInput struct {
	Email    string
	Password string
}

type Tokens struct {
	AccessToken  string
	RefreshToken string
}

type Users interface {
	SignUp(ctx context.Context, input UserSignUpInput) error
	SignIn(ctx context.Context, input UserSignInInput) (Tokens, error)
	RefreshTokens(ctx context.Context, refreshToken string) (Tokens, error)
	Verify(ctx context.Context, userID uint, hash string) error
	CreateSchool(ctx context.Context, userID uint, schoolName string) (domain.School, error)
}

type ConnectFondyInput struct {
	SchoolID         uint
	MerchantID       string
	MerchantPassword string
}

type ConnectSendPulseInput struct {
	SchoolID uint
	ID       string
	Secret   string
	ListID   string
}

type Schools interface {
	Create(ctx context.Context, name string) (uint, error)
	GetByDomain(ctx context.Context, domainName string) (domain.School, error)
	GetById(ctx context.Context, id uint) (domain.School, error)
	UpdateSettings(ctx context.Context, schoolID uint, input domain.UpdateSchoolSettingsInput) error
	ConnectFondy(ctx context.Context, input ConnectFondyInput) error
	ConnectSendPulse(ctx context.Context, input ConnectSendPulseInput) error
}

type StudentSignUpInput struct {
	Name         string
	Email        string
	Password     string
	SchoolID     uint
	SchoolDomain string
	Verified     bool
}

type SchoolSignInInput struct {
	Email    string
	Password string
	SchoolID uint
}

type Students interface {
	SignUp(ctx context.Context, input StudentSignUpInput) error
	SignIn(ctx context.Context, input SchoolSignInInput) (Tokens, error)
	RefreshTokens(ctx context.Context, schoolID uint, refreshToken string) (Tokens, error)
	Verify(ctx context.Context, hash string) error
	GetModuleContent(ctx context.Context, schoolID, studentID, moduleID uint) (domain.ModuleContent, error)
	GetLesson(ctx context.Context, studentID, lessonID uint) (domain.Lesson, error)
	SetLessonFinished(ctx context.Context, studentID, lessonID uint) error
	GiveAccessToOffer(ctx context.Context, studentID uint, offer domain.Offer) error
	RemoveAccessToOffer(ctx context.Context, studentID uint, offer domain.Offer) error
	GetById(ctx context.Context, schoolID, id uint) (domain.Student, error)
	GetBySchool(ctx context.Context, schoolID uint, query domain.GetStudentsQuery) ([]domain.Student, int64, error)
}

type StudentLessons interface {
	AddFinished(ctx context.Context, studentID, lessonID uint) error
	SetLastOpened(ctx context.Context, studentID, lessonID uint) error
}

type Admins interface {
	SignIn(ctx context.Context, input SchoolSignInInput) (Tokens, error)
	RefreshTokens(ctx context.Context, schoolID uint, refreshToken string) (Tokens, error)
	GetCourses(ctx context.Context, schoolID uint) ([]domain.Course, error)
	GetCourseById(ctx context.Context, schoolID, courseID uint) (domain.Course, error)
	CreateStudent(ctx context.Context, inp domain.CreateStudentInput) (domain.Student, error)
	UpdateStudent(ctx context.Context, inp domain.UpdateStudentInput) error
	DeleteStudent(ctx context.Context, schoolID, studentID uint) error
}

type UploadInput struct {
	File        io.Reader
	Filename    string
	Size        int64
	ContentType string
	SchoolID    uint
	Type        domain.FileType
}

type Files interface {
	UploadAndSaveFile(ctx context.Context, file domain.File) (string, error)
	Save(ctx context.Context, file domain.File) (uint, error)
	UpdateStatus(ctx context.Context, fileName string, status domain.FileStatus) error
	GetByID(ctx context.Context, id, schoolID uint) (domain.File, error)
	InitStorageUploaderWorkers(ctx context.Context)
}

type VerificationEmailInput struct {
	Email            string
	Name             string
	VerificationCode string
	Domain           string
}

type StudentPurchaseSuccessfulEmailInput struct {
	Email      string
	Name       string
	CourseName string
}

type Emails interface {
	SendStudentVerificationEmail(VerificationEmailInput) error
	SendUserVerificationEmail(VerificationEmailInput) error
	SendStudentPurchaseSuccessfulEmail(StudentPurchaseSuccessfulEmailInput) error
	AddStudentToList(ctx context.Context, email, name string, schoolID uint) error
}

type UpdateCourseInput struct {
	CourseID    uint
	SchoolID    uint
	Name        *string
	ImageURL    *string
	Description *string
	Color       *string
	Published   *bool
}

type Courses interface {
	Create(ctx context.Context, schoolID uint, name string) (uint, error)
	Update(ctx context.Context, inp UpdateCourseInput) error
	Delete(ctx context.Context, schoolID, courseID uint) error
}

type CreatePromoCodeInput struct {
	SchoolID           uint
	Code               string
	DiscountPercentage int
	ExpiresAt          time.Time
	OfferIDs           []uint
}

type PromoCodes interface {
	Create(ctx context.Context, inp CreatePromoCodeInput) (uint, error)
	Update(ctx context.Context, inp domain.UpdatePromoCodeInput) error
	Delete(ctx context.Context, schoolID, id uint) error
	GetByCode(ctx context.Context, schoolID uint, code string) (domain.PromoCode, error)
	GetById(ctx context.Context, schoolID, id uint) (domain.PromoCode, error)
	GetBySchool(ctx context.Context, schoolID uint) ([]domain.PromoCode, error)
}

type CreateOfferInput struct {
	Name          string
	Description   string
	Benefits      []string
	SchoolID      uint
	Price         domain.Price
	Packages      []uint
	PaymentMethod domain.PaymentMethod
}

type UpdateOfferInput struct {
	ID            uint
	SchoolID      uint
	Name          string
	Description   string
	Benefits      []string
	Price         *domain.Price
	Packages      []uint
	PaymentMethod *domain.PaymentMethod
}

func (i UpdateOfferInput) ValidatePayment() error {
	if i.PaymentMethod == nil {
		return nil
	}

	if !i.PaymentMethod.UsesProvider {
		return nil
	}

	return i.PaymentMethod.Validate()
}

type Offers interface {
	Create(ctx context.Context, inp CreateOfferInput) (uint, error)
	Update(ctx context.Context, inp UpdateOfferInput) error
	Delete(ctx context.Context, schoolID, id uint) error
	GetById(ctx context.Context, id uint) (domain.Offer, error)
	GetByModule(ctx context.Context, schoolID, moduleID uint) ([]domain.Offer, error)
	GetByCourse(ctx context.Context, courseID uint) ([]domain.Offer, error)
	GetAll(ctx context.Context, schoolID uint) ([]domain.Offer, error)
	GetByIds(ctx context.Context, ids []uint) ([]domain.Offer, error)
}

type CreateModuleInput struct {
	SchoolID uint
	CourseID uint
	Name     string
	Position uint
}

type UpdateModuleInput struct {
	ID        uint
	SchoolID  uint
	Name      string
	Position  *uint
	Published *bool
}

type Modules interface {
	Create(ctx context.Context, inp CreateModuleInput) (uint, error)
	Update(ctx context.Context, inp UpdateModuleInput) error
	Delete(ctx context.Context, schoolID, id uint) error
	DeleteByCourse(ctx context.Context, schoolID, courseID uint) error
	GetPublishedByCourseId(ctx context.Context, courseID uint) ([]domain.Module, error)
	GetByCourseId(ctx context.Context, courseID uint) ([]domain.Module, error)
	GetById(ctx context.Context, moduleID uint) (domain.Module, error)
	GetByPackages(ctx context.Context, packageIDs []uint) ([]domain.Module, error)
	GetWithContent(ctx context.Context, moduleID uint) (domain.Module, error)
	GetByLesson(ctx context.Context, lessonID uint) (domain.Module, error)
}

type AddLessonInput struct {
	ModuleID uint
	SchoolID uint
	Name     string
	Position uint
}

type UpdateLessonInput struct {
	LessonID  uint
	SchoolID  uint
	Name      string
	Content   string
	Position  *uint
	Published *bool
}

type Lessons interface {
	Create(ctx context.Context, inp AddLessonInput) (uint, error)
	GetById(ctx context.Context, lessonID uint) (domain.Lesson, error)
	Update(ctx context.Context, inp UpdateLessonInput) error
	Delete(ctx context.Context, schoolID, id uint) error
	DeleteContent(ctx context.Context, schoolID uint, lessonIDs []uint) error
}

type CreatePackageInput struct {
	CourseID uint
	SchoolID uint
	Name     string
	Modules  []uint
}

type UpdatePackageInput struct {
	ID       uint
	SchoolID uint
	Name     string
	Modules  []uint
}

type Packages interface {
	Create(ctx context.Context, inp CreatePackageInput) (uint, error)
	Update(ctx context.Context, inp UpdatePackageInput) error
	Delete(ctx context.Context, schoolID, id uint) error
	GetByCourse(ctx context.Context, courseID uint) ([]domain.Package, error)
	GetById(ctx context.Context, id uint) (domain.Package, error)
	GetByIds(ctx context.Context, ids []uint) ([]domain.Package, error)
}

type Orders interface {
	Create(ctx context.Context, studentID, offerID, promocodeID uint) (uint, error)
	AddTransaction(ctx context.Context, id uint, transaction domain.Transaction) (domain.Order, error)
	GetBySchool(ctx context.Context, schoolID uint, query domain.GetOrdersQuery) ([]domain.Order, int64, error)
	GetById(ctx context.Context, id uint) (domain.Order, error)
	SetStatus(ctx context.Context, id uint, status string) error
}

type Payments interface {
	GeneratePaymentLink(ctx context.Context, orderID uint) (string, error)
	ProcessTransaction(ctx context.Context, callback interface{}) error
}

type CreateSurveyInput struct {
	ModuleID uint
	SchoolID uint
	Survey   domain.Survey
}

type SaveStudentAnswersInput struct {
	ModuleID  uint
	StudentID uint
	SchoolID  uint
	Answers   []domain.SurveyAnswer
}

type Surveys interface {
	Create(ctx context.Context, inp CreateSurveyInput) error
	Delete(ctx context.Context, schoolID, moduleID uint) error
	SaveStudentAnswers(ctx context.Context, inp SaveStudentAnswersInput) error
	GetResultsByModule(ctx context.Context, moduleID uint,
		pagination *domain.PaginationQuery) ([]domain.SurveyResult, int64, error)
	GetStudentResults(ctx context.Context, moduleID, studentID uint) (domain.SurveyResult, error)
}

type Services struct {
	Schools        Schools
	Students       Students
	StudentLessons StudentLessons
	Courses        Courses
	PromoCodes     PromoCodes
	Offers         Offers
	Packages       Packages
	Modules        Modules
	Lessons        Lessons
	Payments       Payments
	Orders         Orders
	Admins         Admins
	Files          Files
	Users          Users
	Surveys        Surveys
	Emails         Emails
}

type Deps struct {
	Repos                  *repository.Repositories
	Cache                  cache.Cache
	Hasher                 hash.PasswordHasher
	TokenManager           auth.TokenManager
	EmailSender            email.Sender
	EmailConfig            config.EmailConfig
	StorageProvider        storage.Provider
	AccessTokenTTL         time.Duration
	RefreshTokenTTL        time.Duration
	FondyCallbackURL       string
	CacheTTL               int64
	OtpGenerator           otp.Generator
	VerificationCodeLength int
	Environment            string
	Domain                 string
}

func NewServices(deps Deps) *Services {
	schoolsService := NewSchoolsService(deps.Repos.Schools, deps.Cache, deps.CacheTTL)
	emailsService := NewEmailsService(deps.EmailSender, deps.EmailConfig, *schoolsService, deps.Cache)
	modulesService := NewModulesService(deps.Repos.Modules, deps.Repos.LessonContent)
	coursesService := NewCoursesService(deps.Repos.Courses, modulesService)
	packagesService := NewPackagesService(deps.Repos.Packages, deps.Repos.Modules)
	offersService := NewOffersService(deps.Repos.Offers, modulesService, packagesService)
	promoCodesService := NewPromoCodeService(deps.Repos.PromoCodes)
	lessonsService := NewLessonsService(deps.Repos.Modules, deps.Repos.LessonContent)
	studentLessonsService := NewStudentLessonsService(deps.Repos.StudentLessons)
	studentsService := NewStudentsService(deps.Repos.Students, modulesService, offersService, lessonsService, deps.Hasher,
		deps.TokenManager, emailsService, studentLessonsService, deps.AccessTokenTTL, deps.RefreshTokenTTL, deps.OtpGenerator, deps.VerificationCodeLength)
	ordersService := NewOrdersService(deps.Repos.Orders, offersService, promoCodesService, studentsService)
	usersService := NewUsersService(deps.Repos.Users, deps.Hasher, deps.TokenManager, emailsService, schoolsService,
		deps.AccessTokenTTL, deps.RefreshTokenTTL, deps.OtpGenerator, deps.VerificationCodeLength, deps.Domain)

	return &Services{
		Schools:        schoolsService,
		Students:       studentsService,
		StudentLessons: studentLessonsService,
		Courses:        coursesService,
		PromoCodes:     promoCodesService,
		Offers:         offersService,
		Modules:        modulesService,
		Payments: NewPaymentsService(ordersService, offersService, studentsService, emailsService, schoolsService,
			deps.FondyCallbackURL),
		Orders: ordersService,
		Admins: NewAdminsService(deps.Hasher, deps.TokenManager, deps.Repos.Admins, deps.Repos.Schools, deps.Repos.Students,
			deps.AccessTokenTTL, deps.RefreshTokenTTL),
		Packages: packagesService,
		Lessons:  lessonsService,
		Files:    NewFilesService(deps.Repos.Files, deps.StorageProvider, deps.Environment),
		Users:    usersService,
		Surveys:  NewSurveysService(deps.Repos.Modules, deps.Repos.SurveyResults, deps.Repos.Students),
		Emails:   emailsService,
	}
}
