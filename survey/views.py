from django.shortcuts import render, redirect
from .forms import UserInfoForm
from .models import UserInfo, UserAnswer
from datetime import datetime
from django.http import HttpResponse
import pandas as pd
import os
from django.contrib import messages

   
def register_user(request):
    if request.method == 'POST':
        form = UserInfoForm(request.POST)
        if form.is_valid():
            user = form.save()
            return redirect('survey_graph', user_id=user.id)
    else:
        form = UserInfoForm()
    return render(request, 'survey/register.html', {'form': form})

def survey_graph(request, user_id):
    try:
        user = UserInfo.objects.get(id=user_id)
    except UserInfo.DoesNotExist:
        raise Http404("User does not exist")
    
    if request.method == 'POST':
        for i in range(1, 11):  # 10 graphs
            impact = request.POST.get(f'impact_{i}')
            probability = request.POST.get(f'probability_{i}')
            if impact and probability:  # Ensure values are not empty
                UserAnswer.objects.create(
                    user=user,
                    graph_number=i,
                    impact_value=float(impact),
                    probability_value=float(probability)
                )
        return redirect('thank_you')
    graph_titles = [
        "1. Navigating Global Uncertainty: Geoplotitical Risks and Chances",
        "2. Building Digital Trust", 
        "3. Circular Economy  and Sustainable Supply Chain", 
        "4. Semantic Web",
        "5. The Power of Digital Twins",
        "6. Leveraging AI",
        "7. Safeguarding Ethical Standards and Regulations",
        "8. Upskilling for the Future: cognitive skills for the hybrid working",
        "9. Advanced Connectivity",
        "10. Autonomous Logistics"
    ]
    graph_data = zip(range(1, 11), graph_titles)
    return render(request, 'survey/graph.html', {
        'user_id': user_id,
        'graph_data': graph_data,
    })

def thank_you(request):
    return render(request, 'survey/thank_you.html')

def export_to_excel(request):
    # Query all UserAnswer data with related UserInfo fields
    data = UserAnswer.objects.select_related('user').values(
        'user__username',          # Username
        'user__role_in_sc',        # Role in SC
        'user__years_working',     # Years working
        'user__date',              # Date of voting
        'user__time',              # Time of voting
        'graph_number',            # Graph number
        'impact_value',            # Impact value
        'probability_value',       # Probability value
    )

    # Convert the data to a pandas DataFrame
    df = pd.DataFrame(data)
    df.rename(columns={
        'user__username': 'Name',
        'user__role_in_sc': 'Role in Supply Chain',
        'user__years_working': 'Years of Working',
        'user__date': 'Date of Voting',
        'user__time': 'Time of Voting',
        'graph_number': 'Graph Number',
        'impact_value': 'Impact Value',
        'probability_value': 'Probability Value',
    }, inplace=True)

    # Create an Excel file in memory
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename="survey_data.xlsx"'
    df.to_excel(response, index=False, engine='openpyxl')

    return response

    # Reset 
def reset_data(request):
    if request.method == "POST":
        # Check if there is any data to reset
        if not UserAnswer.objects.exists() and not UserInfo.objects.exists():
            return HttpResponse("Data have already been reset.", status=200)

        # Step 1: Backup the data
        data = UserAnswer.objects.select_related('user').values(
            'user__username',          # Username
            'user__role_in_sc',        # Role in SC
            'user__years_working',     # Years working
            'user__date',              # Date of voting
            'user__time',              # Time of voting
            'graph_number',            # Graph number
            'impact_value',            # Impact value
            'probability_value',       # Probability value,
        )

        # Convert the data to a pandas DataFrame
        if data.exists():  # Ensure there is data to back up
            df = pd.DataFrame(data)
            df.rename(columns={
                'user__username': 'Name',
                'user__role_in_sc': 'Role in Supply Chain',
                'user__years_working': 'Years of Working',
                'user__date': 'Date of Voting',
                'user__time': 'Time of Voting',
                'graph_number': 'Graph Number',
                'impact_value': 'Impact Value',
                'probability_value': 'Probability Value',
            }, inplace=True)

            # Save the backup file with a timestamp
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_dir = os.path.join(os.getcwd(), 'backups')
            os.makedirs(backup_dir, exist_ok=True)
            backup_file = os.path.join(backup_dir, f'survey_backup_{timestamp}.xlsx')
            df.to_excel(backup_file, index=False, engine='openpyxl')
        else:
            backup_file = "No data to back up."

        # Step 2: Reset the data
        UserAnswer.objects.all().delete()
        UserInfo.objects.all().delete()

        # Step 3: Return a success response
        return HttpResponse("Reset completed successfully.", status=200)

    return HttpResponse("Method not allowed.", status=405)

def reset_page(request):
    return render(request, 'survey/reset.html')

def graph_page(request):
    context = {
        'range': range(1, 11),  # Generates numbers from 1 to 10
    }
    return render(request, 'survey/graph.html', context)
