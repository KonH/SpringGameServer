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

	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
	@MapKey(name = "items")
	private List<Item> items = new ArrayList<>();

	public User() {
	}

	public User(Long id) {
		this.id = id;
	}

	public User(String name) {
		this.name = name;
	}

	public User(Long id, String name) {
		this.id = id;
		this.name = name;
	}

	public User(Long id, String name, List<Item> items) {
		this.id = id;
		this.name = name;
		this.items = items;
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
		str += "items:\n";
		if (items != null) {
			str += items.size() + "\n";
			for (Item item : items) {
				str += "{ id: " + item.getId() +
						", name: '" + item.getName() +
						"', count: " + item.getCount() + " }\n";
			}
		} else {
			str += "null";
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
