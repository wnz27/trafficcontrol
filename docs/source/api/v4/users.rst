..
..
.. Licensed under the Apache License, Version 2.0 (the "License");
.. you may not use this file except in compliance with the License.
.. You may obtain a copy of the License at
..
..     http://www.apache.org/licenses/LICENSE-2.0
..
.. Unless required by applicable law or agreed to in writing, software
.. distributed under the License is distributed on an "AS IS" BASIS,
.. WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
.. See the License for the specific language governing permissions and
.. limitations under the License.
..

.. _to-api-users:

*********
``users``
*********

``GET``
=======
Retrieves all requested users.

:Auth. Required: Yes
:Roles Required: None\ [1]_
:Permissions Required: USER:READ
:Response Type:  Array

Request Structure
-----------------
.. table:: Request Query Parameters

	+-----------+----------+------------------------------------------------------------------------------------------+
	| Name      | Required | Description                                                                              |
	+===========+==========+==========================================================================================+
	| id        | no       | Return only the user identified by this integral, unique identifier                      |
	+-----------+----------+------------------------------------------------------------------------------------------+
	| tenant    | no       | Return only users belonging to the :term:`Tenant` identified by tenant name              |
	+-----------+----------+------------------------------------------------------------------------------------------+
	| role      | no       | Return only users belonging to the :term:`Role` identified by role name                  |
	+-----------+----------+------------------------------------------------------------------------------------------+
	| username  | no       | Return only the user with this username                                                  |
	+-----------+----------+------------------------------------------------------------------------------------------+
	| orderby   | no       | Choose the ordering of the results - must be the name of one of the fields of the        |
	|           |          | objects in the ``response`` array                                                        |
	+-----------+----------+------------------------------------------------------------------------------------------+
	| sortOrder | no       | Changes the order of sorting. Either ascending (default or "asc") or descending ("desc") |
	+-----------+----------+------------------------------------------------------------------------------------------+
	| limit     | no       | Choose the maximum number of results to return                                           |
	+-----------+----------+------------------------------------------------------------------------------------------+
	| offset    | no       | The number of results to skip before beginning to return results. Must use in            |
	|           |          | conjunction with limit                                                                   |
	+-----------+----------+------------------------------------------------------------------------------------------+
	| page      | no       | Return the n\ :sup:`th` page of results, where "n" is the value of this parameter, pages |
	|           |          | are ``limit`` long and the first page is 1. If ``offset`` was defined, this query        |
	|           |          | parameter has no effect. ``limit`` must be defined to make use of ``page``.              |
	+-----------+----------+------------------------------------------------------------------------------------------+

.. code-block:: http
	:caption: Request Example

	GET /api/4.0/users?username=admin HTTP/1.1
	Host: trafficops.infra.ciab.test
	User-Agent: curl/7.47.0
	Accept: */*
	Cookie: mojolicious=...

Response Structure
------------------
:addressLine1:      The user's address - including street name and number
:addressLine2:      An additional address field for e.g. apartment number
:changeLogCount:    The number of change log entries created by the user
:city:              The name of the city wherein the user resides
:company:           The name of the company for which the user works
:country:           The name of the country wherein the user resides
:email:             The user's email address
:fullName:          The user's full name, e.g. "John Quincy Adams"
:gid:               A deprecated field only kept for legacy compatibility reasons that used to contain the UNIX group ID of the user - now it is always ``null``
:id:                An integral, unique identifier for this user
:lastAuthenticated: The date and time at which the user was last authenticated, in :rfc:`3339`
:lastUpdated:       The date and time at which the user was last modified, in :ref:`non-rfc-datetime`
:newUser:           A meta field with no apparent purpose that is usually ``null`` unless explicitly set during creation or modification of a user via some API endpoint
:phoneNumber:       The user's phone number
:postalCode:        The postal code of the area in which the user resides
:publicSshKey:      The user's public key used for the SSH protocol
:registrationSent:  If the user was created using the :ref:`to-api-users-register` endpoint, this will be the date and time at which the registration email was sent - otherwise it will be ``null``
:role:              The name of the role assigned to this user
:stateOrProvince:   The name of the state or province where this user resides
:tenant:            The name of the tenant to which this user belongs
:tenantId:          The integral, unique identifier of the tenant to which this user belongs
:ucdn:              The name of the :abbr:`uCDN (Upstream Content Delivery Network)` to which the user belongs
:uid:               A deprecated field only kept for legacy compatibility reasons that used to contain the UNIX user ID of the user - now it is always ``null``
:username:          The user's username

.. code-block:: http
	:caption: Response Example

	HTTP/1.1 200 OK
	Access-Control-Allow-Credentials: true
	Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Set-Cookie, Cookie
	Access-Control-Allow-Methods: POST,GET,OPTIONS,PUT,DELETE
	Access-Control-Allow-Origin: *
	Content-Type: application/json
	Set-Cookie: mojolicious=...; Path=/; Expires=Mon, 18 Nov 2019 17:40:54 GMT; Max-Age=3600; HttpOnly
	Whole-Content-Sha512: YBJLN8NbOxOvECe1RGtcwCzIPDhyhLpW56nTJHQM5WI2WUDe2mAKREpaEE72nzrfBliq1GABwJlsxq2OdhcFkw==
	X-Server-Name: traffic_ops_golang/
	Date: Thu, 13 Dec 2018 01:03:53 GMT
	Content-Length: 454

	{ "response": [
		{
			"username": "admin",
			"registrationSent": null,
			"addressLine1": null,
			"addressLine2": null,
			"city": null,
			"company": null,
			"country": null,
			"email": null,
			"fullName": null,
			"gid": null,
			"id": 2,
			"newUser": false,
			"phoneNumber": null,
			"postalCode": null,
			"publicSshKey": null,
			"role": "admin",
			"stateOrProvince": null,
			"tenant": "root",
			"tenantId": 1,
			"uid": null,
			"lastUpdated": "2021-08-25T14:08:13.974447-06:00",
			"changeLogCount": 20,
			"lastAuthenticated": "2021-07-09T14:44:10.371708-06:00"
		}
	]}

.. [1] While no roles are required, this endpoint does respect tenancy. A user will only be able to see, create, delete or modify other users belonging to the same tenant, or its descendants.

``POST``
========
Creates a new user.

:Auth. Required: Yes
:Roles Required: "admin" or "operations"\ [1]_
:Permissions Required: USER:CREATE, USER:READ
:Response Type:  Object

Request Structure
-----------------
:addressLine1:       An optional field which should contain the user's address - including street name and number
:addressLine2:       An optional field which should contain an additional address field for e.g. apartment number
:city:               An optional field which should contain the name of the city wherein the user resides
:company:            An optional field which should contain the name of the company for which the user works
:confirmLocalPasswd: The 'confirm' field in a new user's password specification - must match ``localPasswd``
:country:            An optional field which should contain the name of the country wherein the user resides
:email:              The user's email address The given email is validated (circuitously) by `GitHub user asaskevich's regular expression <https://github.com/asaskevich/govalidator/blob/9a090521c4893a35ca9a228628abf8ba93f63108/patterns.go#L7>`_ . Note that it can't actually distinguish a valid, deliverable, email address but merely ensure the email is in a commonly-found format.
:fullName:           The user's full name, e.g. "John Quincy Adams"
:localPasswd:        The user's password
:newUser:            An optional meta field with no apparent purpose - don't use this
:phoneNumber:        An optional field which should contain the user's phone number
:postalCode:         An optional field which should contain the user's postal code
:publicSshKey:       An optional field which should contain the user's public encryption key used for the SSH protocol
:role:               The name that corresponds to the highest permission role which will be permitted to the user
:stateOrProvince:    An optional field which should contain the name of the state or province in which the user resides
:tenantId:           The integral, unique identifier of the tenant to which the new user shall belong

	.. note:: This field is optional if and only if tenancy is not enabled in Traffic Control

:ucdn:               An optional field (only used if :abbr:`CDNi (Content Delivery Network Interconnect)` is in use) containing the name of the :abbr:`uCDN (Upstream Content Delivery Network)` to which the user belongs
:username:           The new user's username

.. code-block:: http
	:caption: Request Example

	POST /api/4.0/users HTTP/1.1
	Host: trafficops.infra.ciab.test
	User-Agent: curl/7.47.0
	Accept: */*
	Cookie: mojolicious=...
	Content-Length: 304
	Content-Type: application/json

	{
		"username": "mike",
		"addressLine1": "22 Mike Wazowski You've Got Your Life Back Lane",
		"city": "Monstropolis",
		"compary": "Monsters Inc.",
		"email": "mwazowski@minc.biz",
		"fullName": "Mike Wazowski",
		"localPasswd": "BFFsully",
		"confirmLocalPasswd": "BFFsully",
		"newUser": true,
		"role": "admin",
		"tenantId": 1
	}

Response Structure
------------------
:addressLine1:     The user's address - including street name and number
:addressLine2:     An additional address field for e.g. apartment number
:city:             The name of the city wherein the user resides
:company:          The name of the company for which the user works
:country:          The name of the country wherein the user resides
:email:            The user's email address
:fullName:         The user's full name, e.g. "John Quincy Adams"
:gid:              A deprecated field only kept for legacy compatibility reasons that used to contain the UNIX group ID of the user - now it is always ``null``
:id:               An integral, unique identifier for this user
:lastUpdated:      The date and time at which the user was last modified, in :ref:`non-rfc-datetime`
:newUser:          A meta field with no apparent purpose that is usually ``null`` unless explicitly set during creation or modification of a user via some API endpoint
:phoneNumber:      The user's phone number
:postalCode:       The postal code of the area in which the user resides
:publicSshKey:     The user's public key used for the SSH protocol
:registrationSent: If the user was created using the :ref:`to-api-users-register` endpoint, this will be the date and time at which the registration email was sent - otherwise it will be ``null``
:role:             The name of the role assigned to this user
:stateOrProvince:  The name of the state or province where this user resides
:tenant:           The name of the tenant to which this user belongs
:tenantId:         The integral, unique identifier of the tenant to which this user belongs
:uid:              A deprecated field only kept for legacy compatibility reasons that used to contain the UNIX user ID of the user - now it is always ``null``
:username:         The user's username

.. code-block:: http
	:caption: Response Example

	HTTP/1.1 201 Created
	Access-Control-Allow-Credentials: true
	Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
	Access-Control-Allow-Methods: POST,GET,OPTIONS,PUT,DELETE
	Access-Control-Allow-Origin: *
	Cache-Control: no-cache, no-store, max-age=0, must-revalidate
	Content-Type: application/json
	Location: /api/4.0/users?id=44
	Date: Thu, 13 Dec 2018 02:28:27 GMT
	X-Server-Name: traffic_ops_golang/
	Set-Cookie: mojolicious=...; Path=/; Expires=Mon, 18 Nov 2019 17:40:54 GMT; Max-Age=3600; HttpOnly
	Vary: Accept-Encoding
	Whole-Content-Sha512: vDqbaMvgeeoIds1czqvIWlyDG8WLnCCJdF14Ub05nsE+oJOakkyeZ8odf4d0Zjtqpk01hoVo14H2tjuWPdqwgw==
	Content-Length: 623

	{ "alerts": [
		{
			"level": "success",
			"text": "user was created."
		}
	],
	"response": {
		"addressLine1": "22 Mike Wazowski You've Got Your Life Back Lane",
		"addressLine2": null,
		"changeLogCount": null,
		"city": "Monstropolis",
		"company": null,
		"confirmLocalPasswd": "BFFsully",
		"country": null,
		"email": "mwazowski@minc.biz",
		"fullName": "Mike Wazowski",
		"gid": null,
		"id": 26,
		"lastAuthenticated": "2021-07-09T14:44:10.371708-06:00",
		"lastUpdated": "2021-08-25T14:43:10.466412-06:00",
		"newUser": true,
		"phoneNumber": null,
		"postalCode": null,
		"publicSshKey": null,
		"registrationSent": null,
		"role": "admin",
		"stateOrProvince": null,
		"tenant": "root",
		"tenantId": 1,
		"uid": null,
		"username": "mike"
	}}
