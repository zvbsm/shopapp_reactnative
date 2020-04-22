import moment from 'moment';

class Order {
	constructor(
		id,
		items,
		totalPrice,
		date
	) {
		this.id = id;
		this.items = items;
		this.totalPrice = totalPrice;
		this.date = date;
	}

	get readableDate() {
		// toLocaleDateString only works on ios, not android
		// return this.date.toLocaleDateString('en-EN', {
		// 	year: 'numeric',
		// 	month: 'long',
		// 	day: 'numeric',
		// 	hour: '2-digit',
		// 	minute: '2-digit'
		// });

		return moment(this.date).format('MMMM Do YYYY, hh:mm');
	}
}

export default Order;