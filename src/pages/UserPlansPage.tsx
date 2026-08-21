import { Footer } from '../components/layout/Footer'
import { Nav } from '../components/layout/Nav'

export function UserPlansPage() {
	return (
		<>
			<Nav />
			<main>
				<section className="section-pad-sm" style={{ paddingTop: 24 }}>
					<div className="container">
					<h1>Мои заявки</h1>
					<p>Здесь будут отображаться ваши заявки.</p>
				</div>
				</section>
			</main>
			<Footer />
		</>
	);
}