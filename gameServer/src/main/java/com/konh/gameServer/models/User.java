package com.konh.gameServer.models;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id")
	private Long id;

	@Column(name = "name")
	private String name;

	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
	@MapKey(name = "items")
	private List<Item> items = new ArrayList<>();

	public User() {
	}

	public User(String name, List<Item> items) {
		this.name = name;
		this.items = items;
	}

	@Override
	public String toString() {
		String str = "";
		str += "id: " + id + "\n";
		str += "name: '" + name + "'\n";
		str += "items (" + items.size() + "):\n";
		for (Item item : items) {
			str += "{ id: " + item.getId() +
					", name: '" + item.getName() +
					"', count: " + item.getCount() + " }";
		}
		return str;
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Item> getItems() {
		return items;
	}

	public void setItems(List<Item> items) {
		this.items = items;
	}
}
