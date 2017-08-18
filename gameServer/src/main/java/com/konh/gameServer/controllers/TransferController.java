package com.konh.gameServer.controllers;


import com.konh.gameServer.exceptions.NotEnoughItemCount;
import com.konh.gameServer.services.TransferService;
import com.konh.gameServer.utils.TransferCommand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.Callable;

@RestController
@RequestMapping("transfer")
public class TransferController {

	@Autowired
	private TransferService transferService;

	@PostMapping
	Callable<ResponseEntity> transfer(@RequestBody TransferCommand command) {
		return () -> {
			try {
				transferService.makeTransfer(command.from, command.to, command.item);
				return ResponseEntity.ok().build();
			} catch (Exception e) {
				return ResponseEntity.badRequest().body(e.toString());
			} catch (NotEnoughItemCount e) {
				return ResponseEntity.badRequest().body(e.toString());
			}
		};
	}
}
