const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const createUser = async (name: string, email: string) => {
  console.log({ backendUrl });
  try {
    const response = await fetch(`${backendUrl}/auth/create`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email })
    });

    return response.json();
  } catch (err) {
    console.error(err);
    return {};
  }
}

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${backendUrl}/auth/users`);
    return response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}
