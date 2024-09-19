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
- This should not have a frontend but work solely as an API

## Background
This is a project completed in Revature training.

## Overview
This project should allow employees to create tickets detailing their expenses
and should allow managers to see said tickets and approve them or deny them.

## Detailed Design
- POST Route to auth/register should default to Employee but if specified should allow Managers to register as such
- POST Route to auth/login checks role and authenticates
- POST Route to employee/tickets only accessible by Employee role to create tickets
- GET Route to employee/tickets accessible by Employee role to see own tickets
- GET Route to manager/tickets accessible by Manager role to see all tickets
- GET Route to manager/tickets?status=pending accessible to Manager and sees all pending employees tickets (any status accepted)
- PUT Route to manager/tickets?ticketId=id accessible to Manager to decide whether to accept or deny tickets

## Solution 1
### Backend
- Node
- Express
- DynamoDB on AWS
- Jest for testing
- Postman to interact with app













