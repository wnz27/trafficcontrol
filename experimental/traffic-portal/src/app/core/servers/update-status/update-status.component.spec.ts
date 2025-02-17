/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
import { HttpClientModule } from "@angular/common/http";
import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { ServerService } from "src/app/api";
import { APITestingModule } from "src/app/api/testing";
import { defaultServer } from "src/app/models";

import { UpdateStatusComponent } from "./update-status.component";

describe("UpdateStatusComponent", () => {
	let component: UpdateStatusComponent;
	let fixture: ComponentFixture<UpdateStatusComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ UpdateStatusComponent ],
			imports: [ HttpClientModule, APITestingModule ],
		}).compileComponents();
		fixture = TestBed.createComponent(UpdateStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("gets server names", () => {
		expect(component.serverName).toBe("0 servers");
		component.servers = [{
			...defaultServer,
			hostName: "host",
		}];
		expect(component.serverName).toBe("host");
		component.servers.push({...defaultServer, hostName: "a different host"});
		expect(component.serverName).toBe("2 servers");
	});

	it("sets the 'current' status ID based on selected servers", () => {
		expect(component.currentStatus).toBeNull();

		fixture = TestBed.createComponent(UpdateStatusComponent);
		component = fixture.componentInstance;
		component.servers = [{...defaultServer, statusId: 9001}];
		fixture.detectChanges();
		expect(component.currentStatus).toBe(9001);

		fixture = TestBed.createComponent(UpdateStatusComponent);
		component = fixture.componentInstance;
		component.servers = [{...defaultServer, statusId: 9001}, {...defaultServer, statusId: 9001}];
		fixture.detectChanges();
		expect(component.currentStatus).toBe(9001);

		fixture = TestBed.createComponent(UpdateStatusComponent);
		component = fixture.componentInstance;
		component.servers = [{...defaultServer, statusId: 9001}, {...defaultServer, statusId: 9}];
		fixture.detectChanges();
		expect(component.currentStatus).toBeNull();
	});

	it("cancels", () => {
		let isDone = false;
		const spy = jasmine.createSpy("doneSubscription", (v: boolean): void => {
			expect(v).toBe(isDone);
		});
		component.done.subscribe(spy);
		isDone = true;
		component.cancel();
		expect(spy).toHaveBeenCalled();
		component.closeOnEscape(new KeyboardEvent("keydown", {code: "Escape"}));
		expect(spy).toHaveBeenCalledTimes(2);
		component.closeOnEscape(new KeyboardEvent("keydown", {code: "Esc"}));
		expect(spy).toHaveBeenCalledTimes(3);
	});

	it("knows if the user-selected status is an 'offline' status", () => {
		expect(component.statusControl.value).toBeNull();
		expect(component.isOffline).toBeFalse();

		component.statusControl.setValue(undefined);
		expect(component.isOffline).toBeFalse();

		component.statusControl.setValue({name: "OFFLINE"});
		expect(component.isOffline).toBeTrue();

		component.statusControl.setValue({name: "some weird custom status"});
		expect(component.isOffline).toBeTrue();

		component.statusControl.setValue({name: "ONLINE"});
		expect(component.isOffline).toBeFalse();

		component.statusControl.setValue({name: "REPORTED"});
		expect(component.isOffline).toBeFalse();
	});

	it("submits a request to update each server", async () => {
		let isDone = true;
		const spy = jasmine.createSpy("doneSubscription", (v: boolean): void => {
			expect(v).toBe(isDone);
		});
		component.done.subscribe(spy);

		const service = TestBed.inject(ServerService);
		component.statusControl.setValue((await service.getStatuses()).find(s=>s.name==="ONLINE"));

		const srv = await service.createServer({...defaultServer});
		component.servers = [srv];
		await component.submit(new SubmitEvent("submit"));
		expect(spy).toHaveBeenCalled();

		isDone = true;
		component.statusControl.setValue((await service.getStatuses()).find(s=>s.name==="OFFLINE"));
		await component.submit(new SubmitEvent("submit"));
		expect(spy).toHaveBeenCalledTimes(2);

		isDone = false;
		component.statusControl.setValue({name: "no such status"});
		await component.submit(new SubmitEvent("submit"));
		expect(spy).toHaveBeenCalledTimes(3);
	});
});
