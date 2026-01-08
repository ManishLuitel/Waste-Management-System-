from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from waste.models import Schedule, SpecialRequest, CompostRequest, WasteType, CollectionDay, Ward
from datetime import date, time

class Command(BaseCommand):
    help = 'Seed database with sample data'

    def handle(self, *args, **options):
        # Create admin user
        if not User.objects.filter(username='admin').exists():
            admin_user = User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.save()
            self.stdout.write('Created admin user')

        # Create sample users
        users = []
        for i in range(1, 4):
            user, created = User.objects.get_or_create(
                username=f'user{i}',
                defaults={'email': f'user{i}@example.com'}
            )
            if created:
                user.set_password('password123')
                user.save()
            users.append(user)

        # Create waste types
        waste_types_data = [
            {'name': 'General Waste', 'description': 'Regular household waste', 'color_code': '#6B7280'},
            {'name': 'Recyclable', 'description': 'Recyclable materials', 'color_code': '#3B82F6'},
            {'name': 'Organic/Compost', 'description': 'Organic waste for composting', 'color_code': '#10B981'},
            {'name': 'Hazardous', 'description': 'Hazardous materials', 'color_code': '#EF4444'},
            {'name': 'Electronic', 'description': 'Electronic waste', 'color_code': '#8B5CF6'},
            {'name': 'Bulk Items', 'description': 'Large items', 'color_code': '#F59E0B'}
        ]

        for data in waste_types_data:
            WasteType.objects.get_or_create(**data)

        # Create collection days
        collection_days_data = [
            {'name': 'Monday'},
            {'name': 'Tuesday'},
            {'name': 'Wednesday'},
            {'name': 'Thursday'},
            {'name': 'Friday'},
            {'name': 'Saturday'},
            {'name': 'Sunday', 'is_active': False}
        ]

        for data in collection_days_data:
            CollectionDay.objects.get_or_create(**data)

        # Create wards
        wards_data = [
            {'ward_number': 1, 'name': 'Central Ward', 'description': 'City center area'},
            {'ward_number': 2, 'name': 'North Ward', 'description': 'Northern residential area'},
            {'ward_number': 3, 'name': 'South Ward', 'description': 'Southern commercial area'},
            {'ward_number': 4, 'name': 'East Ward', 'description': 'Eastern industrial area'},
            {'ward_number': 5, 'name': 'West Ward', 'description': 'Western suburban area'}
        ]

        for data in wards_data:
            Ward.objects.get_or_create(**data)

        # Create schedules
        schedules_data = [
            {'ward': 1, 'collection_day': 'Monday', 'waste_type': 'General Waste', 'time': time(8, 0)},
            {'ward': 1, 'collection_day': 'Wednesday', 'waste_type': 'Organic/Compost', 'time': time(9, 0)},
            {'ward': 2, 'collection_day': 'Tuesday', 'waste_type': 'General Waste', 'time': time(8, 30)},
            {'ward': 2, 'collection_day': 'Thursday', 'waste_type': 'Recyclable', 'time': time(9, 30)},
            {'ward': 3, 'collection_day': 'Wednesday', 'waste_type': 'General Waste', 'time': time(10, 0)},
        ]

        for data in schedules_data:
            Schedule.objects.get_or_create(**data)

        # Create special requests
        special_requests_data = [
            {
                'name': 'John Doe',
                'email': 'john@example.com',
                'address': '123 Main St, Ward 1',
                'reason': 'Large furniture disposal',
                'preferred_date': date(2026, 1, 15),
                'preferred_time': time(10, 0),
                'status': 'Pending'
            },
            {
                'name': 'Jane Smith',
                'email': 'jane@example.com',
                'address': '456 Oak Ave, Ward 2',
                'reason': 'Construction waste removal',
                'preferred_date': date(2026, 1, 20),
                'preferred_time': time(14, 0),
                'status': 'Approved'
            },
        ]

        for data in special_requests_data:
            SpecialRequest.objects.get_or_create(**data)

        # Create compost requests
        compost_requests_data = [
            {
                'name': 'Alice Johnson',
                'contact': '555-0123',
                'location': '789 Pine St, Ward 1',
                'waste_type': 'Kitchen scraps',
                'quantity': '2 bags',
                'message': 'Weekly pickup needed'
            },
            {
                'name': 'Bob Wilson',
                'contact': '555-0456',
                'location': '321 Elm St, Ward 3',
                'waste_type': 'Garden waste',
                'quantity': '5 bags',
                'message': 'Seasonal cleanup'
            },
        ]

        for data in compost_requests_data:
            CompostRequest.objects.get_or_create(**data)

        self.stdout.write(self.style.SUCCESS('Successfully seeded database'))