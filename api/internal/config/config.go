package config

import (
	"fmt"
	"os"
	"time"

	"github.com/joho/godotenv"
)

const (
	defaultHTTPPort               = "8000"
	defaultHTTPRWTimeout          = 10 * time.Second
	defaultHTTPMaxHeaderMegabytes = 1
	defaultAccessTokenTTL         = 15 * time.Minute
	defaultRefreshTokenTTL        = 24 * time.Hour * 30
	defaultLimiterRPS             = 10
	defaultLimiterBurst           = 2
	defaultLimiterTTL             = 10 * time.Minute
	defaultVerificationCodeLength = 8
	defaultCacheTTL               = 60 * time.Second

	EnvLocal = "local"
	EnvProd  = "prod"
)

type (
	Config struct {
		Environment string
		MySQL       MySQLConfig
		HTTP        HTTPConfig
		Auth        AuthConfig
		FileStorage FileStorageConfig
		Email       EmailConfig
		Payment     PaymentConfig
		Limiter     LimiterConfig
		CacheTTL    time.Duration
		SMTP        SMTPConfig
	}

	MySQLConfig struct {
		Host     string
		Port     string
		User     string
		Password string
		DBName   string
		DSN      string
	}

	AuthConfig struct {
		JWT                    JWTConfig
		PasswordSalt           string
		VerificationCodeLength int
	}

	JWTConfig struct {
		AccessTokenTTL  time.Duration
		RefreshTokenTTL time.Duration
		SigningKey      string
	}

	FileStorageConfig struct {
		Endpoint  string
		Bucket    string
		AccessKey string
		SecretKey string
	}

	EmailConfig struct {
		Templates EmailTemplates
		Subjects  EmailSubjects
	}

	EmailTemplates struct {
		Verification       string
		PurchaseSuccessful string
	}

	EmailSubjects struct {
		Verification       string
		PurchaseSuccessful string
	}

	PaymentConfig struct {
		FondyCallbackURL string
	}

	HTTPConfig struct {
		Host               string
		Port               string
		ReadTimeout        time.Duration
		WriteTimeout       time.Duration
		MaxHeaderMegabytes int
	}

	LimiterConfig struct {
		RPS   int
		Burst int
		TTL   time.Duration
	}

	SMTPConfig struct {
		Host string
		Port int
		From string
		Pass string
	}
)

// Init populates Config struct with values from .env file and environment variables.
func Init(configsDir string) (*Config, error) {
	// 加载 .env 文件
	if err := godotenv.Load(); err != nil {
		// 如果 .env 文件不存在，继续从环境变量读取
		if !os.IsNotExist(err) {
			return nil, fmt.Errorf("error loading .env file: %w", err)
		}
	}

	populateDefaults()

	// 从环境变量读取配置
	setFromEnv()

	var cfg Config
	if err := unmarshal(&cfg); err != nil {
		return nil, err
	}

	return &cfg, nil
}

func unmarshal(cfg *Config) error {
	cfg.Environment = os.Getenv("APP_ENV")
	if cfg.Environment == "" {
		cfg.Environment = EnvLocal
	}

	// MySQL 配置
	cfg.MySQL.Host = os.Getenv("MYSQL_HOST")
	cfg.MySQL.Port = os.Getenv("MYSQL_PORT")
	cfg.MySQL.User = os.Getenv("MYSQL_USER")
	cfg.MySQL.Password = os.Getenv("MYSQL_PASSWORD")
	cfg.MySQL.DBName = os.Getenv("MYSQL_DBNAME")

	// 构建 DSN
	if dsn := os.Getenv("MYSQL_DSN"); dsn != "" {
		cfg.MySQL.DSN = dsn
	} else if cfg.MySQL.Host != "" {
		cfg.MySQL.DSN = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
			cfg.MySQL.User, cfg.MySQL.Password, cfg.MySQL.Host, cfg.MySQL.Port, cfg.MySQL.DBName)
	}

	// HTTP 配置
	cfg.HTTP.Port = os.Getenv("HTTP_PORT")
	if cfg.HTTP.Port == "" {
		cfg.HTTP.Port = defaultHTTPPort
	}
	cfg.HTTP.ReadTimeout = parseDuration(os.Getenv("HTTP_READ_TIMEOUT"), defaultHTTPRWTimeout)
	cfg.HTTP.WriteTimeout = parseDuration(os.Getenv("HTTP_WRITE_TIMEOUT"), defaultHTTPRWTimeout)
	cfg.HTTP.MaxHeaderMegabytes = parseInt(os.Getenv("HTTP_MAX_HEADER_MEGABYTES"), 1)

	// Auth 配置
	cfg.Auth.PasswordSalt = os.Getenv("PASSWORD_SALT")
	cfg.Auth.JWT.SigningKey = os.Getenv("JWT_SIGNING_KEY")
	cfg.Auth.JWT.AccessTokenTTL = parseDuration(os.Getenv("ACCESS_TOKEN_TTL"), defaultAccessTokenTTL)
	cfg.Auth.JWT.RefreshTokenTTL = parseDuration(os.Getenv("REFRESH_TOKEN_TTL"), defaultRefreshTokenTTL)
	cfg.Auth.VerificationCodeLength = parseInt(os.Getenv("VERIFICATION_CODE_LENGTH"), defaultVerificationCodeLength)

	// Cache 配置
	cfg.CacheTTL = parseDuration(os.Getenv("CACHE_TTL"), defaultCacheTTL)

	// FileStorage 配置
	cfg.FileStorage.Endpoint = os.Getenv("STORAGE_ENDPOINT")
	cfg.FileStorage.Bucket = os.Getenv("STORAGE_BUCKET")
	cfg.FileStorage.AccessKey = os.Getenv("STORAGE_ACCESS_KEY")
	cfg.FileStorage.SecretKey = os.Getenv("STORAGE_SECRET_KEY")

	// Limiter 配置
	cfg.Limiter.RPS = parseInt(os.Getenv("LIMITER_RPS"), defaultLimiterRPS)
	cfg.Limiter.Burst = parseInt(os.Getenv("LIMITER_BURST"), defaultLimiterBurst)
	cfg.Limiter.TTL = parseDuration(os.Getenv("LIMITER_TTL"), defaultLimiterTTL)

	// SMTP 配置
	cfg.SMTP.Host = os.Getenv("SMTP_HOST")
	cfg.SMTP.Port = parseInt(os.Getenv("SMTP_PORT"), 587)
	cfg.SMTP.From = os.Getenv("SMTP_FROM")
	cfg.SMTP.Pass = os.Getenv("SMTP_PASSWORD")

	// Email 配置
	cfg.Email.Templates.Verification = os.Getenv("EMAIL_TEMPLATE_VERIFICATION")
	cfg.Email.Templates.PurchaseSuccessful = os.Getenv("EMAIL_TEMPLATE_PURCHASE_SUCCESSFUL")
	cfg.Email.Subjects.Verification = os.Getenv("EMAIL_SUBJECT_VERIFICATION")
	cfg.Email.Subjects.PurchaseSuccessful = os.Getenv("EMAIL_SUBJECT_PURCHASE_SUCCESSFUL")

	// Payment 配置
	cfg.Payment.FondyCallbackURL = os.Getenv("FONDY_CALLBACK_URL")

	return nil
}

func setFromEnv() {
	// 环境变量已经在 godotenv.Load() 中加载
	// 这里不需要额外操作
}

func parseDuration(s string, defaultVal time.Duration) time.Duration {
	if s == "" {
		return defaultVal
	}
	d, err := time.ParseDuration(s)
	if err != nil {
		return defaultVal
	}
	return d
}

func parseInt(s string, defaultVal int) int {
	if s == "" {
		return defaultVal
	}
	var val int
	_, err := fmt.Sscanf(s, "%d", &val)
	if err != nil {
		return defaultVal
	}
	return val
}

func populateDefaults() {
	// 默认值在 unmarshal 中处理
}
