# inTime

![Project Logo](https://github.com/user-attachments/assets/01c9c174-b4f5-47fe-a580-5465bf3c2869)

inTime is a task management application designed to help users organize, track, and collaborate on tasks effectively. It includes features such as task creation, deletion, updating, push notifications for task reminders, progress tracking, project creation with member management, and integrated chat functionality.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)

## About

inTime is a comprehensive task management tool that facilitates efficient task handling and team collaboration. It offers a range of features to streamline task management processes, enhance productivity, and ensure timely completion of tasks.

## Features

- **Task Management:**
  - Create, delete, and update tasks.
  - Assign tasks to team members.
  - Set task deadlines and receive push notifications for task reminders.

- **Progress Tracking:**
  - Monitor task progress and completion status.
  - Track tasks that were not completed on time.

- **Project Management:**
  - Create projects and manage project-specific tasks.
  - Invite members to projects and assign tasks to them.

- **Communication:**
  - Integrated chat functionality for project members to communicate and collaborate effectively.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB installed and running.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ahmedismail01/inTime.git
   cd inTime

2. **Install Dependencies:**

    Open your terminal and navigate to the root directory of your project. Run the following command to install the required dependencies:

    ```bash
    npm install
    ```

3. **Set Up Environment Variables:**

    Create a `.env` file in the root directory and add the following variables:

    ```makefile
    PORT=8080
    CONNECTION_STRING=mongodb://127.0.0.1:27017/inTime
    ACCESS_TOKEN_PRIVATE_KEY="your_access_token_private_key"
    REFRESH_TOKEN_PRIVATE_KEY="your_refresh_token_private_key"
    NODEMAILER_PASS="your_nodemailer_password"
    NODEMAILER_EMAIL="your_nodemailer_email"
    SITE_URL="your_site_url"
    OTP_LIFESPAN=20
    WEB_PUSH_PUBLIC_KEY="your_web_push_public_key"
    WEB_PUSH_PRIVATE_KEY="your_web_push_private_key"
    ```
  Replace the placeholder values (`your_*`) with your actual configuration values.

4. **Start the Application:**

    Run the following command to start the application:

    ```bash
    npm start
    ```

    The application should now be running on [http://localhost:8080](http://localhost:8080).

## Usage

### Example Scenario

**Creating a Task:**

1. Navigate to the task creation page.
2. Fill in task details such as title, description, deadlines, etc.
3. Click 'Save' to create the task.

**Managing Projects:**

1. Navigate to the projects section.
2. Create a new project and add members to it.
3. Assign tasks to project members and track their progress.

**Using Chat Functionality:**

1. Access the integrated chat feature within a project.
2. Send messages, and collaborate with project members in real-time.
