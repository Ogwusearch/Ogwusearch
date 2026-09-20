# System Architecture

## High Level

                         USER
                           |
                           v
                    APPLICATIONS
                           |
             +-------------+-------------+
             |                           |
             v                           v
      ENGINEERING SERVICES            AI
             |                           |
             |                          MCP
             |                           |
             +-------------+-------------+
                           |
                           v
                 ENGINEERING ENGINES
                           |
                           v
                      VALIDATION
                           |
             +-------------+-------------+
             |                           |
             v                           v
           DATA                       REPORTS


## SolarAudit

UI
|
v
Application Layer
|
v
Engineering Engine
|
v
Validation
|
v
Project Data


## MCP

AI Client
|
v
MCP Server
|
v
Engineering Services
|
v
Engineering Engine
