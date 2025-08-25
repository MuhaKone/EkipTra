import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onLogin, isLoading }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const roleOptions = [
    { value: 'Administrateur', label: 'Administrateur' },
    { value: 'Gestionnaire HSE', label: 'Gestionnaire HSE' },
    { value: 'Technicien', label: 'Technicien' },
    { value: 'Employé', label: 'Employé' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.username?.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    } else if (formData?.username?.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.username)) {
      newErrors.username = 'Format d\'email invalide';
    }

    if (!formData?.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!formData?.role) {
      newErrors.role = 'Veuillez sélectionner un rôle';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onLogin(formData);
    } catch (error) {
      setErrors({ submit: error?.message });
    }
  };

  const handleForgotPassword = () => {
    // Mock forgot password functionality
    alert('Fonctionnalité de récupération de mot de passe non disponible en mode hors ligne');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Username/Email Field */}
      <Input
        label="Nom d'utilisateur ou Email"
        type="text"
        placeholder="Entrez votre nom d'utilisateur ou email"
        value={formData?.username}
        onChange={(e) => handleInputChange('username', e?.target?.value)}
        error={errors?.username}
        required
        disabled={isLoading}
        className="w-full"
      />
      {/* Password Field */}
      <div className="relative">
        <Input
          label="Mot de passe"
          type={showPassword ? "text" : "password"}
          placeholder="Entrez votre mot de passe"
          value={formData?.password}
          onChange={(e) => handleInputChange('password', e?.target?.value)}
          error={errors?.password}
          required
          disabled={isLoading}
          className="w-full pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
          disabled={isLoading}
        >
          <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
        </button>
      </div>
      {/* Role Selection */}
      <Select
        label="Rôle"
        placeholder="Sélectionnez votre rôle"
        options={roleOptions}
        value={formData?.role}
        onChange={(value) => handleInputChange('role', value)}
        error={errors?.role}
        required
        disabled={isLoading}
        className="w-full"
      />
      {/* Submit Error */}
      {errors?.submit && (
        <div className="flex items-center space-x-2 p-3 bg-error/10 border border-error/20 rounded-lg">
          <Icon name="AlertCircle" size={16} className="text-error flex-shrink-0" />
          <span className="text-sm text-error">{errors?.submit}</span>
        </div>
      )}
      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
        iconName="LogIn"
        iconPosition="left"
        className="mt-6"
      >
        Se connecter
      </Button>
      {/* Forgot Password Link */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
          disabled={isLoading}
        >
          Mot de passe oublié ?
        </button>
      </div>
    </form>
  );
};

export default LoginForm;