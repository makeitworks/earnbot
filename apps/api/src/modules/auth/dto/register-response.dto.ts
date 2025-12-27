

export class RegisterResponseDto {
  success: boolean;
  email: string;
  nextStep: 'login'| 'verify-email' | '2fa-setup';
}