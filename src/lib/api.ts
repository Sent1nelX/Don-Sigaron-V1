const API_URL = '/api';

// Общая функция для обработки ответов
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Ошибка сервера' }));
    throw new Error(error.error || 'Ошибка сервера');
  }
  return response.json();
}

// Функция для получения заголовков с токеном авторизации
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
}

// Функция для получения заголовков с токеном для отправки файлов
function getFileHeaders() {
  return {
    'Authorization': getAuthHeaders().Authorization,
  };
}

// Аутентификация
export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
}

export async function register(userData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
}

// Профиль
export async function updateProfile(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}) {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  const response = await fetch(`${API_URL}/profile/password`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return handleResponse(response);
}

// Категории
export async function getCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Не удалось загрузить категории');
  }
}

// Товары
export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);
  return handleResponse(response);
}

export async function getProduct(id: number) {
  const response = await fetch(`${API_URL}/products/${id}`);
  return handleResponse(response);
}

export async function createProduct(formData: FormData) {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: getFileHeaders(),
    body: formData,
  });
  return handleResponse(response);
}

export async function updateProduct(id: number, formData: FormData) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: getFileHeaders(),
    body: formData,
  });
  return handleResponse(response);
}

export async function deleteProduct(id: number) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

// Пользователи
export async function getUsers() {
  const response = await fetch(`${API_URL}/users`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

export async function updateUserStatus(id: number, isBlocked: boolean) {
  const response = await fetch(`${API_URL}/users/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ isBlocked }),
  });
  return handleResponse(response);
}

export async function deleteUser(id: number) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

// Заказы
export async function getOrders() {
  const response = await fetch(`${API_URL}/orders`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

export async function updateOrderStatus(id: number, status: string) {
  const response = await fetch(`${API_URL}/orders/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
}