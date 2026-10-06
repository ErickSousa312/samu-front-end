import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  ArrowRight,
  UserRound,
  LockKeyhole,
  Eye,
  EyeOff,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/shared/context/AuthContext/AuthProvider";
import api from "@/shared/services/api";
import { useToast } from "@/shared/context/ToastContext";
interface LoginFormInputs {
  userName: string;
  password: string;
}
const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();
  const { login, isLoading, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Entrar · SAMU";
  }, []);
  const onSubmit = async (data: LoginFormInputs) => {
    setError("");
    try {
      const response = await api.post("/auth/login", data);
      await login(response.data.access_token, data.userName);
      addToast({ type: "success", message: "Login realizado." });
      navigate("/dashboard");
    } catch {
      setError(
        "Não foi possível entrar. Verifique suas credenciais e tente novamente.",
      );
    }
  };
  if (!isLoading && isAuthenticated)
    return <Navigate to="/dashboard" replace />;
  return (
    <div className="login-shell">
      <main className="login-form-area">
        <div className="login-form">
          <div className="brand">
            <span className="brand-icon">
              <HeartPulse aria-hidden="true" />
            </span>
            <div>
              <strong>SAMU</strong>
              <small>Central de gestão</small>
            </div>
          </div>
          <div className="login-heading">
            <h1>Acessar sistema</h1>
            <p className="muted">Informe seu usuário e senha.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {error && (
              <div role="alert" className="login-error">
                <AlertCircle size={19} aria-hidden="true" />
                <p>{error}</p>
              </div>
            )}
            <div className="field">
              <label htmlFor="login-user">Usuário</label>
              <div className="login-input-wrap">
                <UserRound
                  className="login-input-icon"
                  size={19}
                  aria-hidden="true"
                />
                <input
                  id="login-user"
                  className="input"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="Seu usuário"
                  disabled={isSubmitting || isLoading}
                  {...register("userName", {
                    required: "Informe seu usuário.",
                  })}
                  aria-invalid={!!errors.userName}
                  aria-describedby={
                    errors.userName ? "login-user-error" : undefined
                  }
                />
              </div>
              {errors.userName && (
                <p id="login-user-error" role="alert" className="field-error">
                  {errors.userName.message}
                </p>
              )}
            </div>
            <div className="field">
              <label htmlFor="login-password">Senha</label>
              <div className="login-input-wrap">
                <LockKeyhole
                  className="login-input-icon"
                  size={19}
                  aria-hidden="true"
                />
                <input
                  id="login-password"
                  className="input"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Sua senha"
                  disabled={isSubmitting || isLoading}
                  onKeyDown={(event) =>
                    setCapsLock(event.getModifierState("CapsLock"))
                  }
                  onKeyUp={(event) =>
                    setCapsLock(event.getModifierState("CapsLock"))
                  }
                  {...register("password", {
                    required: "Informe sua senha.",
                    onBlur: () => setCapsLock(false),
                  })}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    [
                      errors.password ? "login-password-error" : "",
                      capsLock ? "login-caps-lock" : "",
                    ]
                      .filter(Boolean)
                      .join(" ") || undefined
                  }
                />
                <button
                  className="login-password-toggle"
                  type="button"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={showPassword}
                  aria-controls="login-password"
                  disabled={isSubmitting || isLoading}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? (
                    <EyeOff size={19} aria-hidden="true" />
                  ) : (
                    <Eye size={19} aria-hidden="true" />
                  )}
                </button>
              </div>
              {capsLock && (
                <p
                  id="login-caps-lock"
                  className="login-caps-lock"
                  role="status"
                >
                  Caps Lock ativado.
                </p>
              )}
              {errors.password && (
                <p
                  id="login-password-error"
                  role="alert"
                  className="field-error"
                >
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              className="button button-primary login-submit"
              type="submit"
              disabled={isSubmitting || isLoading}
              aria-busy={isSubmitting || isLoading}
            >
              {isSubmitting
                ? "Entrando..."
                : isLoading
                  ? "Validando sessão..."
                  : "Entrar no painel"}
              {isSubmitting || isLoading ? (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <ArrowRight size={18} aria-hidden="true" />
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
export default LoginPage;
