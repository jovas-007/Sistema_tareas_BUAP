import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <!-- Header BUAP -->
      <div class="buap-header" *ngIf="!showRegister && !showForgotPassword">
        <div class="buap-logo-container">
          <div class="buap-emblem">🎓</div>
          <div class="buap-text">
            <h1>BUAP</h1>
            <p>Benemérita Universidad Autónoma de Puebla</p>
          </div>
        </div>
      </div>

      <div class="auth-card" [class.compact]="showRegister || showForgotPassword || showVerifyCode || showResetPassword">
        <div class="card-header">
          <h2>{{ 
            showResetPassword ? 'Nueva Contraseña' :
            showVerifyCode ? 'Verificar Código' :
            showForgotPassword ? 'Recuperar Contraseña' : 
            showRegister ? 'Crear Cuenta' : 
            'Sistema de Gestión de Tareas' 
          }}</h2>
          <p class="subtitle" *ngIf="!showRegister && !showForgotPassword && !showVerifyCode && !showResetPassword">Acceso</p>
        </div>
        
        <!-- Formulario de Login -->
        <form (ngSubmit)="login()" *ngIf="!showRegister && !showForgotPassword && !showVerifyCode && !showResetPassword">
          <div class="form-group">
            <label>Matrícula o Correo Electrónico:</label>
            <input 
              type="text" 
              [(ngModel)]="id_usuario" 
              name="id_usuario"
              placeholder="Ejemplo: 202268439 o correo@alumno.buap.mx"
              required>
            <small class="hint">Puede usar su matrícula o correo institucional</small>
          </div>
          
          <div class="form-group">
            <label>Contraseña:</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password"
              placeholder="••••••••"
              required>
          </div>
          
          <div class="message error" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
          
          <button type="submit" class="btn-primary">Ingresar</button>
          
          <button type="button" class="btn-link" (click)="showForgotPassword = true">
            ¿Olvidaste tu contraseña?
          </button>
          
          <button type="button" class="btn-secondary" (click)="showRegister = true">
            Crear cuenta nueva
          </button>
        </form>

        <!-- Formulario de Registro -->
        <form (ngSubmit)="register()" *ngIf="showRegister">
          
          <!-- Selector de Tipo de Usuario -->
          <div class="user-type-selector" *ngIf="!selectedUserType">
            <h3>TIPO DE USUARIO</h3>
            <div class="user-type-options">
              <div class="user-type-option" (click)="selectUserType('docente')">
                <div class="radio-circle"></div>
                <span>Docente</span>
              </div>
              <div class="user-type-option" (click)="selectUserType('estudiante')">
                <div class="radio-circle"></div>
                <span>Estudiante</span>
              </div>
            </div>
          </div>

          <!-- Formulario según el rol seleccionado -->
          <div *ngIf="selectedUserType">
            <div class="selected-role-badge">
              <span>Registrando como: <strong>{{ selectedUserType === 'docente' ? 'Docente' : 'Estudiante' }}</strong></span>
              <button type="button" class="btn-change-role" (click)="changeUserType()">Cambiar</button>
            </div>

            <!-- Campo de Matrícula (solo para Estudiante) -->
            <div class="form-group" *ngIf="selectedUserType === 'estudiante'">
              <label>Matrícula:</label>
              <input 
                type="text" 
                [(ngModel)]="newUser.id_usuario" 
                name="id_usuario"
                placeholder="9 dígitos"
                pattern="[0-9]{9}"
                maxlength="9"
                inputmode="numeric"
                (keypress)="onlyNumbers($event)"
                required>
            </div>
            
            <div class="form-group">
              <label>Nombre Completo:</label>
              <input 
                type="text" 
                [(ngModel)]="newUser.nombre_completo" 
                name="nombre_completo"
                placeholder="Nombre completo"
                required>
            </div>

            <div class="form-group">
              <label>Correo Electrónico:</label>
              <input 
                type="email" 
                [(ngModel)]="newUser.correo" 
                name="correo"
                placeholder="ejemplo@correo.com"
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
                (blur)="validateEmail()"
                required>
              <small class="hint">Formato válido: usuario@dominio.com</small>
            </div>

            <div class="form-group">
              <label>Teléfono:</label>
              <input 
                type="tel" 
                [(ngModel)]="newUser.telefono" 
                name="telefono"
                placeholder="2221234567"
                pattern="[0-9]{10}"
                maxlength="10"
                required>
              <small class="hint">10 dígitos sin espacios ni guiones</small>
            </div>

            <div class="form-group">
              <label>Sexo:</label>
              <select [(ngModel)]="newUser.sexo" name="sexo" required>
                <option value="">Seleccione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <!-- Campo de Carrera (solo para Estudiante) -->
            <div class="form-group" *ngIf="selectedUserType === 'estudiante'">
              <label>Carrera:</label>
              <input 
                type="text" 
                [(ngModel)]="newUser.carrera" 
                name="carrera"
                placeholder="Nombre de la carrera"
                required>
            </div>
            
            <div class="form-group">
              <label>Contraseña:</label>
              <input 
                type="password" 
                [(ngModel)]="newUser.password" 
                name="password"
                placeholder="Mínimo 8 caracteres"
                minlength="8"
                maxlength="15"
                pattern="[a-zA-Z0-9]+"
                required>
              <small class="hint">8-15 caracteres alfanuméricos (letras y números)</small>
            </div>

            <div class="form-group">
              <label>Confirmar Contraseña:</label>
              <input 
                type="password" 
                [(ngModel)]="confirmPassword" 
                name="confirmPassword"
                placeholder="Repita su contraseña"
                maxlength="15"
                required>
            </div>
            
            <div class="message success" *ngIf="successMessage">
              {{ successMessage }}
            </div>
            <div class="message error" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>
            
            <button type="submit" class="btn-primary">Registrar</button>
          </div>

          <button type="button" class="btn-secondary" (click)="backToLogin()">
            Volver al inicio de sesión
          </button>
        </form>

        <!-- Formulario de Recuperación de Contraseña -->
        <form (ngSubmit)="forgotPassword()" *ngIf="showForgotPassword && !showVerifyCode && !showResetPassword">
          <p class="forgot-description">Ingresa tu correo electrónico registrado y te enviaremos un código de verificación.</p>
          
          <div class="form-group">
            <label>Correo Electrónico:</label>
            <input 
              type="email" 
              [(ngModel)]="forgotEmail" 
              name="forgotEmail"
              placeholder="tu_correo@ejemplo.com"
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
              required>
          </div>
          
          <div class="message success" *ngIf="successMessage">
            {{ successMessage }}
          </div>
          <div class="message error" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
          
          <button type="submit" class="btn-primary">Enviar Código</button>
          <button type="button" class="btn-secondary" (click)="backToLogin()">
            Volver al inicio de sesión
          </button>
        </form>

        <!-- Formulario de Verificación de Código -->
        <form (ngSubmit)="verifyCode()" *ngIf="showVerifyCode && !showResetPassword">
          <p class="forgot-description">Ingresa el código de 6 dígitos que enviamos a tu correo.</p>
          
          <div class="form-group">
            <label>Código de Verificación:</label>
            <input 
              type="text" 
              [(ngModel)]="recoveryCode" 
              name="recoveryCode"
              placeholder="123456"
              maxlength="6"
              pattern="[0-9]{6}"
              class="code-input"
              required>
            <small class="hint">El código expira en 15 minutos</small>
          </div>
          
          <div class="message success" *ngIf="successMessage">
            {{ successMessage }}
          </div>
          <div class="message error" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
          
          <button type="submit" class="btn-primary">Verificar Código</button>
          <button type="button" class="btn-secondary" (click)="backToLogin()">
            Cancelar
          </button>
        </form>

        <!-- Formulario de Reset de Contraseña -->
        <form (ngSubmit)="resetPassword()" *ngIf="showResetPassword">
          <p class="forgot-description">Ingresa tu nueva contraseña.</p>
          
          <div class="form-group">
            <label>Nueva Contraseña:</label>
            <input 
              type="password" 
              [(ngModel)]="newPassword" 
              name="newPassword"
              placeholder="Ejemplo: Hola123!"
              minlength="8"
              maxlength="15"
              required>
            <small class="hint">8-15 caracteres, debe incluir: letra, número y signo especial</small>
          </div>

          <div class="form-group">
            <label>Confirmar Contraseña:</label>
            <input 
              type="password" 
              [(ngModel)]="confirmNewPassword" 
              name="confirmNewPassword"
              placeholder="Repite la contraseña"
              maxlength="15"
              required>
          </div>
          
          <div class="message success" *ngIf="successMessage">
            {{ successMessage }}
          </div>
          <div class="message error" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
          
          <button type="submit" class="btn-primary">Cambiar Contraseña</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #002855 0%, #004080 50%, #003366 100%);
      padding: 20px;
      position: relative;
    }

    .auth-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.03" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>');
      background-size: cover;
      opacity: 0.1;
    }

    .buap-header {
      background: white;
      border-radius: 16px 16px 0 0;
      padding: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 450px;
      margin-bottom: -10px;
      z-index: 1;
    }

    .buap-logo-container {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .buap-emblem {
      font-size: 60px;
      filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.1));
    }

    .buap-text h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 800;
      color: #002855;
      letter-spacing: 2px;
    }

    .buap-text p {
      margin: 5px 0 0 0;
      font-size: 13px;
      color: #666;
      font-weight: 500;
    }

    .auth-card {
      background: white;
      padding: 40px;
      border-radius: 0 0 16px 16px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.2);
      width: 100%;
      max-width: 450px;
      z-index: 1;
      position: relative;
    }

    .auth-card.compact {
      border-radius: 16px;
      margin-top: 20px;
    }

    .card-header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 20px;
    }

    h2 {
      color: #002855;
      margin: 0 0 10px 0;
      font-size: 24px;
      font-weight: 700;
    }

    .subtitle {
      color: #666;
      font-size: 14px;
      margin: 0;
    }

    h3 {
      color: #002855;
      text-align: center;
      margin: 0 0 20px 0;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 2px;
    }

    .user-type-selector {
      margin-bottom: 30px;
      text-align: center;
    }

    .user-type-options {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin-top: 20px;
    }

    .user-type-option {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 10px 20px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .user-type-option:hover {
      background: #f0f0f0;
      transform: translateY(-2px);
    }

    .user-type-option span {
      font-size: 16px;
      font-weight: 600;
      color: #002855;
    }

    .radio-circle {
      width: 24px;
      height: 24px;
      border: 3px solid #002855;
      border-radius: 50%;
      position: relative;
      transition: all 0.3s ease;
    }

    .user-type-option:hover .radio-circle {
      border-color: #004080;
      background: #e0f2ff;
    }

    .selected-role-badge {
      background: linear-gradient(135deg, #002855 0%, #004080 100%);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .selected-role-badge span {
      font-size: 14px;
    }

    .btn-change-role {
      background: white;
      color: #002855;
      border: none;
      padding: 6px 12px;
      border-radius: 5px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-change-role:hover {
      background: #f0f0f0;
      transform: scale(1.05);
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #475569;
      font-weight: 600;
    }

    input {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 15px;
      box-sizing: border-box;
      transition: all 0.3s ease;
      background: #fafafa;
    }

    select {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 15px;
      box-sizing: border-box;
      background: #fafafa;
      transition: all 0.3s ease;
    }

    input:focus, select:focus {
      outline: none;
      border-color: #002855;
      background: white;
      box-shadow: 0 0 0 3px rgba(0, 40, 85, 0.1);
    }

    .code-input {
      text-align: center;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
    }

    .message {
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 15px;
      text-align: center;
      font-size: 14px;
    }

    .message.success {
      background: #d1fae5;
      color: #059669;
      border: 1px solid #86efac;
    }

    .message.error {
      background: #fee2e2;
      color: #dc2626;
      border: 1px solid #fca5a5;
    }

    .hint {
      display: block;
      font-size: 12px;
      color: #64748b;
      margin-top: 5px;
    }

    .forgot-description {
      text-align: center;
      color: #64748b;
      font-size: 14px;
      margin-bottom: 20px;
      line-height: 1.5;
    }

    button {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 12px;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #002855 0%, #004080 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(0, 40, 85, 0.3);
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #003366 0%, #0059b3 100%);
      box-shadow: 0 6px 20px rgba(0, 40, 85, 0.4);
      transform: translateY(-2px);
    }
    
    .btn-primary:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(0, 40, 85, 0.3);
    }

    .btn-secondary {
      background: white;
      color: #002855;
      border: 2px solid #002855;
    }

    .btn-secondary:hover {
      background: #002855;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 40, 85, 0.2);
    }
    
    .btn-secondary:active {
      transform: translateY(0);
      box-shadow: 0 2px 5px rgba(0, 40, 85, 0.2);
    }

    .btn-link {
      background: transparent;
      color: #2563eb;
      border: none;
      padding: 8px;
      text-decoration: underline;
      font-size: 13px;
      margin-bottom: 15px;
    }

    .btn-link:hover {
      color: #1d4ed8;
      background: transparent;
      text-decoration: none;
    }
    
    .btn-link:active {
      color: #1e40af;
    }
  `]
})
export class LoginComponent {
  id_usuario = '';
  password = '';
  selectedUserType: 'docente' | 'estudiante' | null = null;
  newUser = {
    id_usuario: '',
    password: '',
    nombre_completo: '',
    correo: '',
    telefono: '',
    sexo: '',
    carrera: '',
    rol: ''
  };
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  showRegister = false;
  showForgotPassword = false;
  showVerifyCode = false;
  showResetPassword = false;
  forgotEmail = '';
  recoveryCode = '';
  newPassword = '';
  confirmNewPassword = '';

  constructor(private authService: AuthService) {}

  selectUserType(type: 'docente' | 'estudiante') {
    this.selectedUserType = type;
    this.newUser.rol = type;
    // Docentes no tienen carrera
    if (type === 'docente') {
      this.newUser.carrera = 'N/A';
    } else {
      this.newUser.carrera = '';
    }
  }

  changeUserType() {
    this.selectedUserType = null;
    this.newUser = {
      id_usuario: '',
      password: '',
      nombre_completo: '',
      correo: '',
      telefono: '',
      sexo: '',
      carrera: '',
      rol: ''
    };
    this.confirmPassword = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  onlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Solo permite números (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  validateEmail() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (this.newUser.correo && !emailRegex.test(this.newUser.correo)) {
      this.errorMessage = 'Formato de correo inválido';
      setTimeout(() => this.errorMessage = '', 3000);
    }
  }

  async forgotPassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.forgotEmail) {
      this.errorMessage = 'Por favor ingrese su correo electrónico';
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.forgotEmail)) {
      this.errorMessage = 'Por favor ingrese un correo electrónico válido';
      return;
    }

    const result = await this.authService.sendRecoveryCode(this.forgotEmail);
    
    if (result.success) {
      this.successMessage = 'Código enviado. Revisa tu correo electrónico';
      setTimeout(() => {
        this.showVerifyCode = true;
        this.successMessage = '';
      }, 2000);
    } else {
      this.errorMessage = result.message || 'Error al enviar código';
    }
  }

  async verifyCode() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.recoveryCode) {
      this.errorMessage = 'Por favor ingrese el código';
      return;
    }

    if (this.recoveryCode.length !== 6) {
      this.errorMessage = 'El código debe tener 6 dígitos';
      return;
    }

    const result = await this.authService.verifyRecoveryCode(this.forgotEmail, this.recoveryCode);
    
    if (result.success) {
      this.successMessage = 'Código verificado correctamente';
      setTimeout(() => {
        this.showResetPassword = true;
        this.successMessage = '';
      }, 1500);
    } else {
      this.errorMessage = result.message || 'Código incorrecto';
    }
  }

  async resetPassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newPassword) {
      this.errorMessage = 'Por favor ingrese una contraseña';
      return;
    }

    if (this.newPassword.length < 8 || this.newPassword.length > 15) {
      this.errorMessage = 'La contraseña debe tener entre 8 y 15 caracteres';
      return;
    }

    if (!/[a-zA-Z]/.test(this.newPassword)) {
      this.errorMessage = 'La contraseña debe contener al menos una letra';
      return;
    }

    if (!/[0-9]/.test(this.newPassword)) {
      this.errorMessage = 'La contraseña debe contener al menos un número';
      return;
    }

    if (!/[^a-zA-Z0-9]/.test(this.newPassword)) {
      this.errorMessage = 'La contraseña debe contener al menos un signo especial';
      return;
    }

    if (this.newPassword !== this.confirmNewPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    const result = await this.authService.resetPassword(
      this.forgotEmail, 
      this.recoveryCode, 
      this.newPassword
    );
    
    if (result.success) {
      this.successMessage = 'Contraseña actualizada correctamente. Redirigiendo...';
      setTimeout(() => {
        this.backToLogin();
      }, 2000);
    } else {
      this.errorMessage = result.message || 'Error al cambiar contraseña';
    }
  }

  async login() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.id_usuario || !this.password) {
      this.errorMessage = 'Por favor complete todos los campos';
      return;
    }

    const result = await this.authService.login(this.id_usuario, this.password);
    console.log('Login result:', result);
    
    if (result.success) {
      // Esperar un poco para asegurar que localStorage se guarde
      await new Promise(resolve => setTimeout(resolve, 100));
      
      this.successMessage = 'Inicio de sesión exitoso. Redirigiendo...';
      
      // Redirigir según el rol del usuario al puerto 3000 donde están los HTML
      const currentUser = this.authService.getCurrentUser();
      console.log('Current user after login:', currentUser);
      
      if (!currentUser) {
        console.error('ERROR: No se pudo obtener el usuario del localStorage');
        this.errorMessage = 'Error al guardar sesión';
        return;
      }
      
      console.log('User role:', currentUser.rol);
      console.log('LocalStorage content:', localStorage.getItem('currentUser'));
      
      // Esperar un momento para que el mensaje se muestre
      setTimeout(() => {
        const dashboardUrl = currentUser.rol === 'docente' 
          ? 'http://localhost:3000/src/screens/admin-dashboard.html'
          : 'http://localhost:3000/src/screens/student-dashboard.html';
        
        console.log('Redirecting to:', dashboardUrl);
        window.location.href = dashboardUrl;
      }, 500);
    } else {
      this.errorMessage = 'Matrícula/Correo o contraseña incorrectos';
    }
  }

  async register() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.selectedUserType) {
      this.errorMessage = 'Por favor seleccione un tipo de usuario';
      return;
    }

    // Validación según el tipo de usuario
    if (this.selectedUserType === 'estudiante') {
      // Validación: matrícula de exactamente 9 dígitos para estudiantes
      if (!/^\d{9}$/.test(this.newUser.id_usuario)) {
        this.errorMessage = 'La matrícula debe tener exactamente 9 dígitos';
        return;
      }

      // Validar que tenga carrera
      if (!this.newUser.carrera || this.newUser.carrera.trim() === '') {
        this.errorMessage = 'Por favor ingrese su carrera';
        return;
      }
    } else {
      // Para docente, generar ID automático basado en el correo
      this.newUser.id_usuario = this.newUser.correo.split('@')[0] + '_' + Date.now();
    }

    // Validaciones comunes
    if (!this.newUser.password || !this.confirmPassword ||
        !this.newUser.nombre_completo || !this.newUser.correo || 
        !this.newUser.telefono || !this.newUser.sexo) {
      this.errorMessage = 'Por favor complete todos los campos';
      return;
    }

    // Validación: correo electrónico válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newUser.correo)) {
      this.errorMessage = 'Por favor ingrese un correo electrónico válido';
      return;
    }

    // Validación: teléfono de exactamente 10 dígitos
    if (!/^\d{10}$/.test(this.newUser.telefono)) {
      this.errorMessage = 'El teléfono debe tener exactamente 10 dígitos';
      return;
    }

    // Validación: contraseña mínimo 8 y máximo 15 caracteres
    if (this.newUser.password.length < 8 || this.newUser.password.length > 15) {
      this.errorMessage = 'La contraseña debe tener entre 8 y 15 caracteres';
      return;
    }

    // Validación: debe contener al menos una letra
    if (!/[a-zA-Z]/.test(this.newUser.password)) {
      this.errorMessage = 'La contraseña debe contener al menos una letra';
      return;
    }

    // Validación: debe contener al menos un número
    if (!/[0-9]/.test(this.newUser.password)) {
      this.errorMessage = 'La contraseña debe contener al menos un número';
      return;
    }

    // Validación: debe contener al menos un signo especial
    if (!/[^a-zA-Z0-9]/.test(this.newUser.password)) {
      this.errorMessage = 'La contraseña debe contener al menos un signo especial';
      return;
    }

    // Validación: confirmar contraseña
    if (this.newUser.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    const result = await this.authService.register(this.newUser);
    
    if (result.success) {
      this.successMessage = '¡Usuario registrado exitosamente!';
      setTimeout(() => {
        this.backToLogin();
      }, 1500);
    } else {
      this.errorMessage = result.message || 'Error al registrar usuario';
    }
  }

  backToLogin() {
    this.showRegister = false;
    this.showForgotPassword = false;
    this.showVerifyCode = false;
    this.showResetPassword = false;
    this.selectedUserType = null;
    this.newUser = {
      id_usuario: '',
      password: '',
      nombre_completo: '',
      correo: '',
      telefono: '',
      sexo: '',
      carrera: '',
      rol: ''
    };
    this.confirmPassword = '';
    this.forgotEmail = '';
    this.recoveryCode = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
    this.errorMessage = '';
    this.successMessage = '';
  }
}
