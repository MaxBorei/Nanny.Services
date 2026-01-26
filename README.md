Nanny.Services — Babysitter Marketplace (React + Vite)
=====================
A babysitter catalog with authentication, protected favorites, and appointment booking via modal forms.
Routing is handled with React Router. Forms use react-hook-form + Yup validation. UI includes reusable modal and error components (page / inline), animations via Framer Motion, and styling via CSS Modules.

This is a React project bootstrapped with Vite.

Tech stack:
-----------------------------------

<li> React,
<li> TypeScript,
<li> Vite,
<li> React Router — routing, protected pages, 404 fallback,
<li> react-hook-form — form state + performance,
<li> Yup + @hookform/resolvers — schema validation,
<li> Framer Motion — UI animations,
<li> CSS Modules — component styles.

Features:
-----------------------------------

<li>Nannies catalog page;
<li>Favorites page доступна лише авторизованим користувачам (ProtectedRoute);
<li>Modal windows: Login, Registration, Appointment;
<li>Validated forms (loginSchema / registerSchema / appointmentSchema);
<li>Appointment form includes custom TimePicker (Controller integration);
<li>ErrorView supports page mode (404) and inline mode (form errors);
<li>Responsive layout and clean UI components.
