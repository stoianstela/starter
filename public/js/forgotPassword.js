import axios from 'axios';
import { showAlert } from './alerts';

document.querySelector('.form--forgot-password').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.querySelector('input[name="email"]').value;
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/forgotPassword',
            data: { email }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Check your email for the password reset link.');
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
});
