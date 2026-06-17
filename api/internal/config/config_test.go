package config

import (
	"os"
	"reflect"
	"testing"
	"time"
)

func TestInit(t *testing.T) {
	type env struct {
		mysqlDSN         string
		passwordSalt     string
		jwtSigningKey    string
		host             string
		fondyCallbackURL string
		frontendUrl      string
		smtpPassword     string
		appEnv           string
		storageEndpoint  string
		storageBucket    string
		storageAccessKey string
		storageSecretKey string
	}

	type args struct {
		path string
		env  env
	}

	setEnv := func(env env) {
		os.Setenv("MYSQL_DSN", env.mysqlDSN)
		os.Setenv("PASSWORD_SALT", env.passwordSalt)
		os.Setenv("JWT_SIGNING_KEY", env.jwtSigningKey)
		os.Setenv("HTTP_HOST", env.host)
		os.Setenv("FONDY_CALLBACK_URL", env.fondyCallbackURL)
		os.Setenv("FRONTEND_URL", env.frontendUrl)
		os.Setenv("SMTP_PASSWORD", env.smtpPassword)
		os.Setenv("APP_ENV", env.appEnv)
		os.Setenv("STORAGE_ENDPOINT", env.storageEndpoint)
		os.Setenv("STORAGE_BUCKET", env.storageBucket)
		os.Setenv("STORAGE_ACCESS_KEY", env.storageAccessKey)
		os.Setenv("STORAGE_SECRET_KEY", env.storageSecretKey)
	}

	tests := []struct {
		name    string
		args    args
		want    *Config
		wantErr bool
	}{
		{
			name: "test config",
			args: args{
				path: "fixtures",
				env: env{
					mysqlDSN:         "root:qwerty@tcp(localhost:3306)/testDatabase?charset=utf8mb4&parseTime=True&loc=Local",
					passwordSalt:     "salt",
					jwtSigningKey:    "key",
					host:             "localhost",
					fondyCallbackURL: "https://ultrathreads.com/callback",
					frontendUrl:      "http://localhost:1337",
					smtpPassword:     "qwerty123",
					appEnv:           "local",
					storageEndpoint:  "test.filestorage.com",
					storageBucket:    "test",
					storageAccessKey: "qwerty123",
					storageSecretKey: "qwerty123",
				},
			},
			want: &Config{
				Environment: "local",
				CacheTTL:    time.Second * 3600,
				HTTP: HTTPConfig{
					Host:               "localhost",
					MaxHeaderMegabytes: 1,
					Port:               "80",
					ReadTimeout:        time.Second * 10,
					WriteTimeout:       time.Second * 10,
				},
				Auth: AuthConfig{
					PasswordSalt: "salt",
					JWT: JWTConfig{
						RefreshTokenTTL: time.Minute * 30,
						AccessTokenTTL:  time.Minute * 15,
						SigningKey:      "key",
					},
					VerificationCodeLength: 10,
				},
				MySQL: MySQLConfig{
					DSN: "root:qwerty@tcp(localhost:3306)/testDatabase?charset=utf8mb4&parseTime=True&loc=Local",
				},
				FileStorage: FileStorageConfig{
					Endpoint:  "test.filestorage.com",
					Bucket:    "test",
					AccessKey: "qwerty123",
					SecretKey: "qwerty123",
				},
				Email: EmailConfig{
					Templates: EmailTemplates{
						Verification:       "./templates/verification_email.html",
						PurchaseSuccessful: "./templates/purchase_successful.html",
					},
					Subjects: EmailSubjects{
						Verification:       "Спасибо за регистрацию, %s!",
						PurchaseSuccessful: "Покупка прошла успешно!",
					},
				},
				Payment: PaymentConfig{
					FondyCallbackURL: "https://ultrathreads.com/callback",
				},
				Limiter: LimiterConfig{
					RPS:   10,
					Burst: 2,
					TTL:   time.Minute * 10,
				},
				SMTP: SMTPConfig{
					Host: "mail.privateemail.com",
					Port: 587,
					From: "maksim@ultrathreads.com",
					Pass: "qwerty123",
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			setEnv(tt.args.env)

			got, err := Init(tt.args.path)
			if (err != nil) != tt.wantErr {
				t.Errorf("Init() error = %v, wantErr %v", err, tt.wantErr)

				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Init() got = %v, want %v", got, tt.want)
			}
		})
	}
}
