# My Tasks - Task Manager Application
**by: Kadiri Muheebat Kofoworola**

# App Description
- My Tasks is a simple task manager application built with React Native and Expo that helps users to create, manage and organize their tasks. It supports:

- Adding tasks and assigning them their priority [High, Medium, Low]
- Marking tasks as completed
- Deleting tasks
- Editing tasks
- Setting reminders using local notifications
- Storing tasks locally using AsyncStorage

# How to set up and run the application using Expo Go

* Before proceeding, ensure the following tools are installed in your system
- Node.js
- Expo CLI
- Expo Go app on your mobile device

* After that

- Clone the repository by running this in your terminal
* git clone https://github.com/muheebah005/My-Tasks-App.git
* cd My-Tasks-App
  
- Install dependencies by running
* npm install
  
- Then start the development server by running
* npx expo start (this will launch the Expo developer tools in your browser and display a QR code in the terminal or web interface)

- Running the app on your device
* Open the Expo Go app on your mobile device
* Scan the QR code with the Expo Go Scanner or your mobile device camera
* The app will automatically load on your mobile device

**Note: Make sure your mobile device and your development machine are connected to the same wifi network*

# Challenges & Design Choices
- Persistent Storage: Tasks are stored using AsyncStorage so they persist across app restart
- Notification Timing: Since background scheduling is limited in Expo Go, I scheduled task notifications 1 minute after creation as a simple reminder proof-of-concept.
- Editing Constraints: Tasks can only be edited if they're not marked as completed, keeping the logic simple and intentional.
- UI Decisions: I used custom colors and clean layouts to keep the interface minimal yet functional.


