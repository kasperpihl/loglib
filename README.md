# Title

Logging properties
lambda: 'worker' | 'api'

What determines if server is in bad state

- Number of DLQ > 0
- Errors

## Query params

logs:stage
`group=api|worker` Default all
`level=INFO|WARN|ERROR` Default INFO
`time=` Default tail
`keys=all | none | test1 , test2` Default all
`search=some query`
