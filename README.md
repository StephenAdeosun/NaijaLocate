Locale is a developer tool for anyone who needs to know Nigeria, geographically at least. Locale’s API shows you all of Nigeria’s regions, states, and local government areas(LGAs). Locale is looking to be a very useful tool for the thousands of businesses building for Nigeria’s 200M+ population size. 

Requirements And Implementation Guide:

– Authentication and Authorization: Locale as a developer should be protected and every developer who tries to access the API should have an API key to authenticate their request. Developers will have their API key generated for them when they sign up. They can only see this API key once.

– Search: Locale allows developers to search for information about Nigeria based on the following categories; region, state, and local government area(LGAs). It is possible that developers would want to search for a region with the states under them but not the local government. This also applies to states with LGAs. Locale should also return all metadata associated with each region, state, or LGA on search.

– General APIs: Developers on Locale should be able to get all regions, states, and LGA with an API(s)

Best practices:

You are required to build with Nodejs (TypeScript).
Don’t always hit the DB, use a cache layer.
Ensure you implement rate-limiting
Ensure you write unit and integration tests where possible
It would be better if you could spec and document the API with OpenAPI using something like https://stoplight.io/
