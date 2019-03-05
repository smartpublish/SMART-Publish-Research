import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing';

import { IdentityService, HttpErrorHandler, AlertService, Identity } from '.'
import { Data } from '@angular/router'

describe('IdentityService', () => {
  let httpClient: HttpClient
  let httpTestingController: HttpTestingController
  let identityService: IdentityService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        IdentityService,
        HttpErrorHandler,
        AlertService
      ]
    })
    
    // Inject the http, test controller, and service-under-test
    // as they will be referenced by each test.
    httpClient = TestBed.get(HttpClient)
    httpTestingController = TestBed.get(HttpTestingController)
    identityService = TestBed.get(IdentityService)
  })

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  })

  it('#getIdentities() should return expected identities', () => {
    let expectedIdentites = [
      { ethAccount: '0x3DE95E0653F8c8CF7679a316389B7eA11DC0Dd9C', fullname: 'Dr. Hector Phillips' },
      { ethAccount: '0x2EE95E0653F8c8CF7679a316389B7eA11DC0Dd8E', fullname: 'Emily Dickerson' },
      { ethAccount: '0x1DE95E0653F8c8CF7679a316389B7eA11DC0Dd7D', fullname: 'Octavio Esparza' }
    ] as Identity[]

    let accounts = [
      expectedIdentites[0].ethAccount,
      expectedIdentites[1].ethAccount,
      expectedIdentites[2].ethAccount
    ]
    identityService.getIdentities(accounts).subscribe(
      identities => {
        expect(identities).toEqual(expectedIdentites, 'should return expected identities')
      },
      fail
    );

    // IdentitiesService should have made one request to GET identities from expected URL
    const req = httpTestingController.expectOne(identityService.identitiesUrl)
    expect(req.request.method).toEqual('GET')

    // Respond with the mock identities
    req.flush(expectedIdentites)
  })

  it('#getIdentities() should fails with 404 when accounts do not exist', () => {
    let mockResponse = { status: 404, statusText: 'Not Found'}
    let expectedIdentites = [
      { ethAccount: '0x3DE95E0653F8c8CF7679a316389B7eA11DC0Dd9C', fullname: 'Dr. Hector Phillips' },
      { ethAccount: '0x2EE95E0653F8c8CF7679a316389B7eA11DC0Dd8E', fullname: 'Emily Dickerson' },
      { ethAccount: '0x1DE95E0653F8c8CF7679a316389B7eA11DC0Dd7D', fullname: 'Octavio Esparza' }
    ] as Identity[]
    let accounts = [
      expectedIdentites[0].ethAccount,
      expectedIdentites[1].ethAccount,
      expectedIdentites[2].ethAccount
    ]
    identityService.getIdentities(accounts).subscribe(
      res => expect(res.status).toEqual(404, 'should return not found status code 404'),
      fail
    )
    
    const req = httpTestingController.expectOne(identityService.identitiesUrl)
    req.flush(mockResponse)
  })

  it('#registerIdentity() should register a new identity', () => {
    const mockResponse = { status: 201, statusText: 'Created' }

    let jwt = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9'
    let signature = 'TCYt5XsITJX1CxPCT8yAV-TVkIEq_PbChOMqsLfRoPsnsgw5WEuts01mq-pQy7UJiN5mgRxD-WUcX16dUEMGlv50aqzpqh4Qktb3rk-BuQy72IFLOqV0G_zS245-kronKb78cPN25DGlcTwLtjPAYuNzVBAh4vGHSrQyHUdBBPM'
    let account = '0x1DE95E0653F8c8CF7679a316389B7eA11DC0Dd7D'
    let fullname = 'Octavio Esparza'
    identityService.registerIdentity(jwt, signature, account, fullname).subscribe(
      res => expect(res.status).toEqual(201, 'should return created status code 201'),
      fail
    )
    
    const req = httpTestingController.expectOne(identityService.identitiesUrl)
    expect(req.request.method).toEqual('POST')

    req.flush(mockResponse)
  })

})
