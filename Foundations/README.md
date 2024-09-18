# FOUNDATIONS PROJECT
Link: [Link to this doc](#)

Author(s): Gustavo Gamboa Malaver

Status: [Draft]

Last Updated: 2024-09-18

## Contents
- Goals
- Non-Goals
- Background
- Overview
- Detailed Design
  - Solution 1
    - Backend

## Objective
This is a backend project to leverage the NED stack
Node, Express,DynamoDB using the AWS SDK and
Unit testing with Jest

## Goals
- To develop a ticketing reimbursement system for a company 
## Non-Goals
- this should not have a frontend but work solely as an API

## Background
This is a project completed in Revature training.

## Overview
This project should allow employees to create tickets detailing their expenses
and should allow managers to see said tickets and approve them or deny them.

## Detailed Design
-Route to /register should default to Employee but if specified should allow Managers to register as such
-Route to /login checks role and authenticates
-Route to /create-ticket only accessible by Employee role
-Route to /view-ticket-history accessible by Employee and Manager roles but employee can only see their own
-Route to /view-pending-tickets accessible to Manager and sees all employees tickets
-Route to /process-ticket accessible to Manager to decide whether to accept or deny tickets

## Solution 1
### Backend
-Node
-Express
-DynamoDB on AWS
-Jest for testing
-Postman to interact with app













