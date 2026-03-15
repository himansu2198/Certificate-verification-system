# Certificate Verification System

The **Certificate Verification System** is a web application designed to streamline the process of issuing and verifying internship certificates.

This platform allows administrators to upload student certificate data in bulk using an Excel sheet. The uploaded data includes details such as **certificate ID, student name, internship domain, and internship duration**.

Students can search for their certificate using a **unique certificate ID**, view their certificate with all the relevant details pre-filled, and download it in a printable format.

The system is built using the **MERN Stack** to ensure efficient data handling and a seamless user experience.

---

# Tech Stack

This project is built using the following technologies:

* **MongoDB** – Database for storing student and certificate data
* **Express.js** – Backend framework for handling APIs
* **React.js** – Frontend user interface
* **Node.js** – Runtime environment for server-side development

---

# Features

## User Roles and Authentication

* Create and manage **Admin accounts**
* Create and manage **User accounts**
* Secure login system with authentication
* Session-based access control

---

## Certificate Search and Verification

Students can easily verify their certificates.

* Search certificate using **Certificate ID**
* Display certificate details instantly
* Verify certificate authenticity before downloading
* **QR Code verification for additional security**

---

## Data Management

Administrators can efficiently manage certificate data.

* Upload **bulk student data via Excel file**
* Store certificate records securely in **MongoDB**
* Fast and reliable data handling

---

## Certificate Generation

The system automatically generates certificates using stored student data.

* Automatically populate certificate details
* Generate certificates with accurate student information
* Reduce manual errors during certificate creation

---

## Certificate Download

Students can download their certificates after verification.

* Download certificates after viewing details
* Certificates available in **printable format (PDF)**

---

## Security and Data Integrity

The system ensures data protection and accuracy.

* Secure authentication system
* Data validation during Excel upload
* Prevent incorrect or incomplete data entries
* Maintain integrity of certificate records

---

# Project Workflow

1. Admin logs into the system
2. Admin uploads student certificate data using an Excel sheet
3. The system stores data securely in the database
4. Students search for their certificate using **Certificate ID**
5. The system displays certificate details with a **QR verification option**
6. Students download the certificate

---

# Installation Guide

## Clone the Repository

```bash
git clone https://github.com/himansu2198/Certificate-verification-system.git
```

## Navigate to Project Folder

```bash
cd Certificate-verification-system
```

## Install Dependencies

```bash
npm install
```

## Run the Project

```bash
npm start
```


