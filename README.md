Certificate Verification System
Overview

The Certificate Verification System is a web application designed to simplify the process of issuing and verifying internship certificates.

Administrators can upload student certificate data through an Excel sheet containing details such as certificate ID, student name, internship domain, and internship duration.

Students can then search for their certificate using the certificate ID, view the certificate with pre-filled information, and download it in a printable format.

This system improves certificate management, verification, and accessibility for students and administrators.

Tech Stack

This project is built using the MERN stack:

MongoDB – Database for storing certificate and user data

Express.js – Backend framework for API development

React.js – Frontend user interface

Node.js – Server runtime environment

Features
User Roles and Authentication

Create and manage Admin accounts

Create and manage User accounts

Secure authentication and session management

Certificate Search and Verification

Students can search certificates using a unique certificate ID

View certificate details before downloading

Quick and simple verification process

Data Management

Admins can upload bulk student data via Excel files

All certificate data stored securely in MongoDB

Efficient data handling and management

Certificate Generation

Automatically generate certificates using uploaded data

Populate certificates with correct student information

Reduce manual errors during certificate creation

Certificate Download

Students can download certificates after verification

Certificates available in printable format (PDF)

Security and Data Integrity

Secure login system

Data validation during Excel upload

Prevents incorrect or incomplete data entries

Project Workflow

Admin logs into the system

Admin uploads student certificate data via Excel sheet

Data is stored securely in the database

Students search for their certificate using Certificate ID

System displays the certificate with pre-filled details

Students can download the certificate

Installation and Setup
1. Clone the Repository
git clone https://github.com/himansu2198/Certificate-verification-system.git
2. Navigate to the Project
cd Certificate-verification-system
3. Install Dependencies
npm install
4. Run the Project
npm start
